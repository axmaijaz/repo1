import { EventBusService } from 'src/app/core/event-bus.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';
import { AwsService } from './aws.service';
import { EmitEvent, EventTypes } from '../event-bus.service';

declare const MediaRecorder: any;
@Injectable({
  providedIn: 'root',
})
export class S3RecordingService {
  gdmOptions = {
    audio: true,
    video: true,
    // video: {
    //   cursor: "always"
    // },
    // audio: {
    //   echoCancellation: true,
    //   noiseSuppression: true,
    //   sampleRate: 44100
    // }
  };
  mediaRecorderObj;
  rocordableStream;
  uploadVideo: boolean;
  isRecording: boolean;
  recordingIntervalValue = 60;
  recordingInterval: NodeJS.Timeout;
  MyStream: any;
  constructor(private awsService: AwsService,private eventBus: EventBusService, private toaster: ToastService) {}
  GetRecorder = (addAudio: boolean) => new Promise(async (resolve) => {
    const hasMicPerm = await navigator.permissions.query({name: 'microphone' as any});
    const hasCamPerm = await navigator.permissions.query({name: 'camera' as any});
    if (hasMicPerm.state !== 'granted') {
      this.toaster.warning('microphone permission is denied');
      addAudio = false;
    }
    let audioStream = null;
    if (addAudio) {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }
    if (!audioStream || !audioStream.getAudioTracks() || !audioStream.getAudioTracks().length) {
      addAudio = false;
    }
    const videoStream = await navigator.mediaDevices['getDisplayMedia']({ video: true, audio: false });
    if (videoStream.getVideoTracks() && videoStream.getVideoTracks()?.length) {
      videoStream.getVideoTracks()[0].onended =  this.StopSharingClicked;
    }
    // "accelerometer",
    // "ambient-light-sensor",
    // "background-fetch",
    // "background-sync",
    // "bluetooth",
    // "camera",
    // "display-capture",
    // "geolocation",
    // "gyroscope",
    // "magnetometer",
    // "microphone",
    // "midi",
    // "nfc",
    // "notifications",
    // "persistent-storage",
    // "push",
    // "screen-wake-lock",
    // "speaker-selection",
    // "xr-spatial-tracking"
    this.MyStream = {};
    if (addAudio) {
      const tracks = [...videoStream.getTracks(), ...audioStream.getAudioTracks()];
      this.MyStream = new MediaStream(tracks);
    } else {
      this.MyStream = videoStream;
    }
    let options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = { mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = { mimeType: '' };
        }
      }
    }
    const mediaRecorder = new MediaRecorder(this.MyStream, options);
    const recordingChunks = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      recordingChunks.push(event.data);
    });

    const start = () => {
      return mediaRecorder.start();
    };

    const stop = () =>
      new Promise((stopResolve) => {
        mediaRecorder.addEventListener('stop', () => {
          const recordingBlob = new Blob(recordingChunks);
          const recordingUrl = URL.createObjectURL(recordingBlob);
          // const audio = new Audio(audioUrl);
          // const play = () => audio.play();
          stopResolve({ recordingBlob, recordingUrl });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  })
  uploadTOS3 = (recordedData) => {
    const dataUrl = URL.createObjectURL(recordedData);
    const s3Key = `TestRecordings/video-file-${new Date().toISOString()}.webm`;
    const file = this.blobToFile(
      recordedData,
      `video-file-${new Date().toISOString()}.webm`
    );
    const request = this.awsService.uploadUsingSdk(file, s3Key).then(
      (data) => {
        this.uploadVideo = false;
        // const newFile = {
        //   id: this.videoData.id,
        //   title: this.videoData.title,
        //   path: this.videoData.preSignedUrl
        //  };

        this.toaster.success('Video Successfully Uploaded');
      },
      (err) => {
        this.uploadVideo = false;
        this.toaster.error('Video Not Uploaded');
      }
    );
  };
  blobToFile(theBlob, fileName) {
    const b = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    // Cast to a File() type
    return theBlob;
  }
  StopSharingClicked = () => {
    this.DestroyStreamIfAny();
    if (!this.isRecording) {
      return;
    }
    const event = new EmitEvent();
    event.name = EventTypes.stopRecordingEmit;
    event.value = '';
    this.eventBus.emit(event);
  }
  saveFile(recordedData) {
    // const blob = new Blob(recordedData, {
    //   type: 'video/webm'
    // });
    const blob = recordedData;
    const filename = window.prompt('Enter file name'),
      downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
  }
  startRecordingInterval() {
    this.isRecording = true;
    this.recordingInterval = setInterval(() => {
      --this.recordingIntervalValue;
      if (this.recordingIntervalValue < 1) {
        this.StopSharingClicked();
      }
    }, 1000);
  }
  stopRecordingInterval() {
    clearInterval(this.recordingInterval);
    this.isRecording = false;
    this.recordingIntervalValue = 60;
    this.DestroyStreamIfAny();
  }
  DestroyStreamIfAny() {
    if (this.MyStream) {
      (this.MyStream as MediaStream).getTracks().forEach(x => {
        x.stop();
      });
    }
  }
}
