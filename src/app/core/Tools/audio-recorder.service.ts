import { EventEmitter, Injectable } from '@angular/core';

declare var MediaRecorder: any;

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {

  private chunks: Array<any> = [];
  protected recorderEnded = new EventEmitter();
  public recorderError = new EventEmitter<ErrorCase>();
  public pitchEmitter = new EventEmitter<number>();
  // tslint:disable-next-line
  private _recorderState = RecorderState.INITIALIZING;
  mediaStream: MediaStream;
  pitchInterval: NodeJS.Timeout;

  constructor() {
  }

  private recorder: any;


  private static guc() {
    return navigator.mediaDevices.getUserMedia({audio: true});
  }


  getUserContent() {
    return AudioRecorderService.guc();
  }

  startRecording() {
    if (this._recorderState === RecorderState.RECORDING) {
      this.recorderError.emit(ErrorCase.ALREADY_RECORDING);
    }
    if (this._recorderState === RecorderState.PAUSED) {
      this.resume();
      return;
    }
    this._recorderState = RecorderState.INITIALIZING;
    AudioRecorderService.guc().then((mediaStream) => {
      this.mediaStream = mediaStream;

      this.recorder = new MediaRecorder(mediaStream, {
        mimeType: 'audio/webm',
        numberOfAudioChannels: 1,
        audioBitsPerSecond : 16000,
      });
      this._recorderState = RecorderState.INITIALIZED;
      this.addListeners();
      this.recorder.start();
      this._recorderState = RecorderState.RECORDING;
      this.DetectPitch(mediaStream)
    });
  }

  pause() {
    if (this._recorderState === RecorderState.RECORDING) {
      this.recorder.pause();
      this._recorderState = RecorderState.PAUSED;
    }
  }

  resume() {
    if (this._recorderState === RecorderState.PAUSED) {
      this._recorderState = RecorderState.RECORDING;
      this.recorder.resume();
    }
  }

  async stopRecording(outputFormat: OutputFormat) {
    this._recorderState = RecorderState.STOPPING;
    try {
      return await new Promise((resolve, reject) => {
        this.recorderEnded.subscribe((blob) => {
          this._recorderState = RecorderState.STOPPED;
          this.stopMedia();
          if (outputFormat === OutputFormat.WEBM_BLOB) {
            resolve(blob);
          }
          if (outputFormat === OutputFormat.WEBM_BLOB_URL) {
            const audioURL = URL.createObjectURL(blob);
            resolve(audioURL);
          }
        }, (error) => {
          this.recorderError.emit(ErrorCase.RECORDER_TIMEOUT);
          reject(ErrorCase.RECORDER_TIMEOUT);
        });
        this.recorder.stop();
      });
    } catch {
      this.recorderError.emit(ErrorCase.USER_CONSENT_FAILED);
    }
  }

  getRecorderState() {
    return this._recorderState;
  }

  abortRecording() {
    this.stopRecording(OutputFormat.WEBM_BLOB_URL)
    this.stopMedia();
  }
  blobToFile(theBlob, fileName, duration) {
    const b = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    b.duration = duration;

    // Cast to a File() type
    return theBlob;
  }

  private DetectPitch(stream: MediaStream) {
    let audioCtx = new (window.AudioContext || window['webkitAudioContext'])();
    let analyserNode = audioCtx.createAnalyser()
    const microphoneStream = audioCtx.createMediaStreamSource(stream);


    let audioData = new Float32Array(analyserNode.fftSize);;
    let corrolatedSignal = new Float32Array(analyserNode.fftSize);;
    let localMaxima = new Array(10);
    microphoneStream.connect(analyserNode);

    audioData = new Float32Array(analyserNode.fftSize);
    corrolatedSignal = new Float32Array(analyserNode.fftSize);

    this.pitchInterval = setInterval(() => {
        analyserNode.getFloatTimeDomainData(audioData);

        let pitch = this.getAutocorrolatedPitch(audioCtx , audioData, corrolatedSignal, localMaxima, analyserNode);

        // frequencyDisplayElement.innerHTML = `${pitch}`;
        // console.log('Your pitch ' + pitch)
        this.pitchEmitter.emit(pitch)
    }, 500);
  }
  getAutocorrolatedPitch(audioCtx , audioData, corrolatedSignal, localMaxima, analyserNode)
    {
        // First: autocorrolate the signal

        let maximaCount = 0;

        for (let l = 0; l < analyserNode.fftSize; l++) {
            corrolatedSignal[l] = 0;
            for (let i = 0; i < analyserNode.fftSize - l; i++) {
                corrolatedSignal[l] += audioData[i] * audioData[i + l];
            }
            if (l > 1) {
                if ((corrolatedSignal[l - 2] - corrolatedSignal[l - 1]) < 0
                    && (corrolatedSignal[l - 1] - corrolatedSignal[l]) > 0) {
                    localMaxima[maximaCount] = (l - 1);
                    maximaCount++;
                    if ((maximaCount >= localMaxima.length))
                        break;
                }
            }
        }

        // Second: find the average distance in samples between maxima

        let maximaMean = localMaxima[0];

        for (let i = 1; i < maximaCount; i++)
            maximaMean += localMaxima[i] - localMaxima[i - 1];

        maximaMean /= maximaCount;

        return audioCtx.sampleRate / maximaMean;
    }


  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      if (this.mediaStream) {
        this.mediaStream.getAudioTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }
    }
    clearInterval(this.pitchInterval)
  }

  private addListeners() {
    this.recorder.ondataavailable = this.appendToChunks;
    this.recorder.onstop = (this.recordingStopped as any);
  }

  private appendToChunks = (event: any) => {
    this.chunks.push(event.data);
  };
  private recordingStopped = (event: any) => {
    const blob = new Blob(this.chunks, { type : 'audio/wav; codecs=MS_PCM' });
    this.chunks = [];
    this.recorderEnded.emit(blob);
    this.clear();
  };

  private clear() {
    this.recorder = null;
    this.chunks = [];
  }
}


export enum OutputFormat {
  WEBM_BLOB_URL,
  WEBM_BLOB,
}

export enum ErrorCase {
  USER_CONSENT_FAILED,
  RECORDER_TIMEOUT,
  ALREADY_RECORDING
}

export enum RecorderState {
  INITIALIZING,
  INITIALIZED,
  RECORDING,
  PAUSED,
  STOPPING,
  STOPPED
}
export enum AudioRecordingIntervalState {
  Start,
  Pause,
  Stop
}
