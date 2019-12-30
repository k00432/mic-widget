import React from "react";


interface Props {

}
interface State {

    decibel: number
    audioCtx: AudioContext
    intervalId:number

}





class App extends React.Component {
    analyser?: AnalyserNode;
    state: State = {
        decibel: 0,
        audioCtx: new AudioContext(),
        intervalId:0
    }
    constructor(props: Props) {
        super(props);
        this.init();
    }
    init() {
        this.analyser = this.state.audioCtx.createAnalyser()
        this.analyser.minDecibels = -50;
        this.analyser.maxDecibels = -30;
        this.analyser.smoothingTimeConstant = 0.85;
        this.analyser.fftSize = 32;
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            let source = this.state.audioCtx.createMediaStreamSource(stream)
            source.connect(this.analyser!)
            let intervalId =setInterval(this.interval, 100)
            this.setState({intervalId})
        })
    }
    interval = () => {
        var bufferLength = this.analyser!.frequencyBinCount
        var dataArray = new Uint8Array(bufferLength);
        this.analyser!.getByteFrequencyData(dataArray)
        var max = dataArray.reduce(function (previous, current) {
            return previous > current ? previous : current;
        });
        console.log(max/2.55)
        this.setState({ decibel: max / 2.55 })
    }
    onclick = () => {
        clearInterval(this.state.intervalId)
        this.state.audioCtx.resume().then(() => {
            console.log('Playback resumed successfully');
            
            this.init()
        })
    }
    render() {
        return (
            <>
                <div className="mic" onClick={this.onclick}>
                    <div className="vol" style={{ width: `${this.state.decibel}%` }}> </div>
                </div>

            </>
        )
    }
}

export default App;
