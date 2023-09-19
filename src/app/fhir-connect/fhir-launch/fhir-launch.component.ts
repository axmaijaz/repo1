import { Component, OnInit } from '@angular/core';
import FHIR from "fhirclient";
import { BrandingService } from 'src/app/core/branding.service';
import { FhirServersData } from 'src/app/model/FHIR/FhirServers.model';

@Component({
  selector: 'app-fhir-launch',
  templateUrl: './fhir-launch.component.html',
  styleUrls: ['./fhir-launch.component.scss']
})
export class FhirLaunchComponent implements OnInit {

  constructor(public brandingService: BrandingService) { }

  ngOnInit(): void {
    this.AuthorizeFhirClient();
  }
  urlParam(p) {
    var query = location.search.replace(/^\?/, "");
    var data = query.split("&");
    var result = [];
    var i, item;

    for (i = 0; i < data.length; i++) {
      item = data[i].split("=");
      if (item[0] === p) {
        return decodeURIComponent(item[1].replace(/\+/g, '%20'));
      }
    }

    return null;
  }
  async AuthorizeFhirClient() {
    // const client  = FHIR.oauth2.client({
    //   clientId: "e63c0f05-9690-466b-be2c-a082629c294c",
    //   scope: "launch openid fhirUser profile patient/*.*  offline_access",
    //   serverUrl: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/"
    // });
    // const codeVerifier = FHIR.oauth2.utils.codeVerifier();
    // const codeChallenge = FHIR.oauth2.utils.codeChallenge(codeVerifier);
      // var codeVerifier = this.generateCodeVerifier(16);
      // var codeChallenge = await this.generateCodeChallenge(codeVerifier);
    FHIR.oauth2.authorize({

      // The client_id that you should have obtained after registering a client at
      // the EHR.
      // clientId: "tYHDiRrwuqPhLdqJD4CpGUGv4jSx0pEwEQUWqbmTz4c", // ECW
      // clientId: "42df9f03-7e6c-4c83-86b0-51f4d1dc4960", // EPIC prod
      // clientId: "e63c0f05-9690-466b-be2c-a082629c294c", // EPIC non prod works
      clientId: FhirServersData.ClientId(), // EPIC non prod works

      // The scopes that you request from the EHR. In this case we want to:
      // launch            - Get the launch context
      // openid & fhirUser - Get the current user
      // patient/*.read    - Read patient data
      // scope: "launch openid fhirUser profile patient/*.*  offline_access online_access",
      scope: FhirServersData.Data().scope,
      // scope: "launch openid fhirUser profile patient/*.* organization",
      // noRedirect: false,
      // iss: this.urlParam("iss"),
      // launch: this.urlParam("launch"),

      // Typically, if your redirectUri points to the root of the current directory
      // (where the launchUri is), you can omit this option because the default value is
      // ".". However, some servers do not support directory indexes so "." and "./"
      // will not automatically map to the "index.html" file in that directory.
      redirectUri: FhirServersData.Data().redirectUri,
      // completeInTarget: true
      // Include the code verifier in the configuration object
      // codeVerifier: codeVerifier,
      // // Include the code challenge in the configuration object
      // codeChallenge: codeChallenge
    })
    // .then(async (authorizeUrl) => {
    //   // Generate the code challenge from the code verifier
    //   debugger
    //   var codeVerifier = this.generateCodeVerifier(43);
    //   var codeChallenge = await this.generateCodeChallenge(codeVerifier);
    //   // client.auth.codeChallenge = codeChallenge;
    //   try {

    //     localStorage.setItem('sj-1', authorizeUrl || 'dfdfdfd')
    //     localStorage.setItem('sj-verifier', codeVerifier)
    //     localStorage.setItem('sj-challenge', codeChallenge)
    //     localStorage.setItem('sj-method', "S384")
    //   } catch (error) {

    //   }
    //   // Redirect the user to the authorization URL
    //   window.location.href = authorizeUrl + '&code_challenge=' + codeChallenge + '&code_challenge_method=S384';
    // });
    // initialize({
    //     client_id: "my_web_app",
    //     scope: "patient/*.read openid profile"
    //   });
  }
  generateCodeVerifier(length) {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    var verifier = '';
    for (var i = 0; i < length; i++) {
      verifier += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return verifier;
  }

  // Generate a code challenge from the code verifier for PKCE
  async generateCodeChallenge(verifier) {
    var encoder = new TextEncoder();
    var data = encoder.encode(verifier);
    var digest = await crypto.subtle.digest('SHA-384', data);
    return this.base64url(new Uint8Array(digest));
  }

  // Base64 URL encode a string
  base64url(source) {
    var encoded = btoa(String.fromCharCode.apply(null, source));
    return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

}
