import React from 'react'
import './voice.css'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';

const Voice = () =>
{
    const{
        transcript,
        listening,
        resetTranscript,
        BrowserSupport
    } = useSpeechRecognition();
    // if (!BrowserSupport){
    //     return <span> Browser doesn't support Speech Recognition</span>
    // }
    return (
                <div classname="content">
                <div className="header">
                    <div className="text">
                        Audio Recorder
                        <div className="underline">
                        </div>
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        Transcript
                        <textarea placeholder={transcript}/>
                    </div>
                </div>
                <div className="submit-container">
                    <div className="submit">
                        <button onClick={SpeechRecognition.startListening}>Start</button>
                    </div>
                    <div className="submit">
                        <button onClick={SpeechRecognition.stopListening}>Pause</button>
                    </div>
                    <div className="submit">
                        <button onClick={resetTranscript}>Reset</button>
                    </div>
                </div>
            </div>
    );
}

export default Voice;