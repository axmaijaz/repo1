import { Injectable } from '@angular/core';
import AWS from 'aws-sdk';
import { environment } from 'src/environments/environment';
import { Key } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl : environment.baseUrl;
  public awsSdk = AWS;
  constructor(private http: HttpClient, private httpErrorService: HttpErrorHandlerService) {
    this.awsSdk.config.update({
      accessKeyId: environment.accessKeyAws,
      secretAccessKey: environment.secretKeyAws
      // accessKeyId: 'AKIA3EBLWZ2DTNY3Q3NL',
      // secretAccessKey: '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'
    });
  }
  uploadUsingSdk(file: any, path: string, isLogo = false) {
    const upload = new this.awsSdk.S3.ManagedUpload({
      partSize: 10 * 1024 * 1024, queueSize: 1,
      params: {
        // Bucket: 'locummed-data-dev2',
        Bucket: isLogo ? environment.logoAws : environment.bucketAws,
        Key: path,
        Body: file,
        // ACL: 'public-read'
      }
    });
    return upload.promise();
  }
  uploadUsingSdkForProgress(data: any, path: string, bucket: string, ContentType = '', Metadata?: AWS.S3.Metadata) {
    var params: AWS.S3.PutObjectRequest = {
      // Bucket: 'locummed-data-dev2',
      Bucket: bucket || environment.bucketAws,
      Key: path,
      Body: data,
      // ACL: 'public-read'
    }
    if (ContentType) {
      params['ContentType'] = ContentType;
    }
    if (Metadata) {
      params['Metadata'] = Metadata;
    }
    const upload = new this.awsSdk.S3.ManagedUpload({
      partSize: 10 * 1024 * 1024, queueSize: 1, params
    });
    return upload;
  }
  GetPublicUrl(url: string) {

    const s3 = new this.awsSdk.S3();
    var getParams = {
      Bucket: environment.bucketAws, // your bucket name,
      Key: url // path to the object you're looking for
    }
    return s3.getObject(getParams).promise();
  }
  GetSignedUrl(path: string, bucketName = environment.bucketAws) {
    const s3 = new this.awsSdk.S3();
    var result =  s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: path,
      Expires: 60 * 15
    })
    // console.log(result)
    return result;
  }
  getPublicPath(url: string) {
    return this.http
      .get(this.baseUrl + 'S3/GetPublicUrl?path=' + url)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  GetCloudWatchLogs() {
    const cloudWatch = new this.awsSdk.CloudWatch();
    cloudWatch.getDashboard()
  }
  CreateFolder(folderName){
    return this.http
    .get(this.baseUrl + `S3/CreateFolder?key=${folderName}`)
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFolders(folderName){
    return this.http
    .get(this.baseUrl + `S3/GetFolders?key=${folderName}`)
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadFile(obj){
    return this.http
    .post(this.baseUrl + `S3/UploadFile`,obj)
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFile(fileName){
    return this.http
    .get(this.baseUrl + `S3/GetFile?key=${fileName}`)
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteFile(fileName){
    return this.http
    .get(this.baseUrl + `S3/DeleteFile?key=${fileName}`)
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteFolder(folderName){
    return this.http
    .get(this.baseUrl + `S3/DeleteFolder?key=${folderName}`)
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
