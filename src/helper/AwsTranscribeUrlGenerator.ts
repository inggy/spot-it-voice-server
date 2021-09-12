import crypto from "crypto";
import * as v4 from "./aws-signature-v4";

const region = "us-west-2";
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

export function createPresignedUrl() {
    let endpoint = "transcribestreaming." + region + ".amazonaws.com:8443";

    // get a preauthenticated URL that we can use to establish our WebSocket
    return v4.createPresignedURL(
        'GET',
        endpoint,
        '/stream-transcription-websocket',
        'transcribe',
        crypto.createHash('sha256').update('', 'utf8').digest('hex'), {
            'key': accessKey,
            'secret': secretKey,
            'protocol': 'wss',
            'expires': 300,
            'region': region,
            'query': "language-code=en-US&media-encoding=pcm&sample-rate=44100&enable-partial-results-stabilization=true"
        }
    );
}