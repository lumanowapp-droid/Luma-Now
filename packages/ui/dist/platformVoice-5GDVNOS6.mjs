import "./chunk-3X2YHN6Q.mjs";

// ../core/src/voice/platformVoice.web.ts
var VoiceServiceImpl = class {
  mediaRecorder = null;
  audioChunks = [];
  stream = null;
  async requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  }
  async startRecording() {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: "audio/webm"
    });
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };
    this.mediaRecorder.start();
  }
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"));
        return;
      }
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        const uri = URL.createObjectURL(audioBlob);
        this.stream?.getTracks().forEach((track) => track.stop());
        resolve({
          uri,
          duration: 0,
          // Duration not easily available in web
          mimeType: "audio/webm"
        });
      };
      this.mediaRecorder.stop();
    });
  }
  async transcribe(recording) {
    const response = await fetch(recording.uri);
    const audioBlob = await response.blob();
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    const apiResponse = await fetch("/api/transcribe", {
      method: "POST",
      body: formData
    });
    if (!apiResponse.ok) {
      throw new Error("Transcription failed");
    }
    const result = await apiResponse.json();
    return {
      text: result.text,
      confidence: result.confidence,
      language: result.language
    };
  }
  isAvailable() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  isEnabled() {
    return true;
  }
};
export {
  VoiceServiceImpl
};
