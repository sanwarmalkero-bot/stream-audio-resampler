// stream-audio-resampler v1.0.0
// A lightweight linear interpolation utility to downsample real-time audio streams.

function streamAudioResampler(inputBuffer, fromSampleRate, toSampleRate) {
    if (fromSampleRate === toSampleRate) return inputBuffer;
    if (fromSampleRate < toSampleRate) {
        throw new Error("Upsampling is not supported by this utility.");
    }

    const sampleRateRatio = fromSampleRate / toSampleRate;
    const newLength = Math.round(inputBuffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    
    let offsetResult = 0;
    let offsetInput = 0;

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0;
        let count = 0;

        for (let i = offsetInput; i < nextOffsetBuffer && i < inputBuffer.length; i++) {
            accum += inputBuffer[i];
            count++;
        }

        result[offsetResult] = count > 0 ? accum / count : 0;
        offsetResult++;
        offsetInput = nextOffsetBuffer;
    }

    return result;
}

export default streamAudioResampler;
