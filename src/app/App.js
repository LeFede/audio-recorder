import React, { Component } from 'react'
//import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
//import UploadImageToS3WithNativeSdk from './UploadImageToS3WithNativeSdk'
const axios = require('axios')
//import Recorder from './Recorder'

class App extends Component {

    constructor() {
        super()
        this.state = {
            name: '',
            //audioFile: '',
            audios: [],
            _id: '',
            newName: '',

            recordState: null,
        }
        this.addRecord = this.addRecord.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.confirmRename = this.confirmRename.bind(this)
        this.reverseAudios = this.reverseAudios.bind(this)
        //this.test = this.test.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.onStop = this.onStop.bind(this)
    }

    
    start() {
        this.setState({
            recordState: RecordState.START
          })
    }

    stop() {
        this.setState({
          recordState: RecordState.STOP
        })
    }

    onStop(audioData) {
        console.log('audioData', audioData)
    }

    addRecord(e) {

        e.preventDefault()
        if (!this.state.name) return

        let blobUrl = document.querySelector('#recorded-audio').src
        //console.log()
        let file
        fetch(blobUrl)
            .then(res => res.blob())
            .then(blob => {
                //console.error(blob)
                // Here's where you get access to the blob
                // And you can use it for whatever you want
                // Like calling ref().put(blob)
            
                // Here, I use it to make an image appear on the page
                // let objectURL = URL.createObjectURL(blob);
                // let myImage = new File();
                // myImage.src = objectURL;
                // document.getElementById('myImg').appendChild(myImage)
                file = new File([blob], `${this.state.name}.wav`)
                //console.error(file)
                let data = new FormData()
                data.append('name', this.state.name)
                data.append('audioFile', file)

                axios.post(
                    '/api/audios',
                    data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then(res => {
                    
                    this.setState({
                        name: '',

                    })
                    this.fetchAudios()

                })

            })
        //
        //

        //console.log(file)
        
        // data.append('audioFile', file)

        // fetch('/api/audios', {
        //     method: 'POST',
        //     body: data,//JSON.stringify(this.state),
        //     headers: {
        //         //'Accept': 'application/json',
        //         //'Content-Type': 'application/json',
        //         //'Content-Type': 'multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD',
        //         //'Content-Type': 'multipart/form-data; boundary=---------------------------974767299852498929531610575'
                
        //     }
        // })
        // .then(res => res.json())
        // .then(data => {
        //     console.log(data)
        //     M.toast({ html: 'Record Saved' })
        //     this.setState({ name: '', audioFile: '' })
        //     this.fetchAudios()
        // })
        // .catch(err => { console.error(err) })

    }

    componentDidMount() {
        this.fetchAudios()
    }

    fetchAudios() {
        fetch('/api/audios')
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                this.setState({ audios: data })
            })
    }

    reverseAudios() {
        if (this.state.audios.length <= 1) return
        M.toast({html: 'Reversed!'})
        this.setState({audio : this.state.audios.reverse()})
    }

    renameAudio(id) {
        fetch(`/api/audios/${id}`)
            .then(res => res.json())
            .then(data => {
                this.setState({

                    _id: data._id
                })
                console.log(this.state.name , this.state._id)
            })
    }

    deleteAudio(id) {

        if (confirm('Are you sure?')) {
            fetch(`/api/audios/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    M.toast({ html: 'Audio Deleted' })
                    this.fetchAudios()
                })
                .catch(err => { console.log(err) })
        }

    }

    handleChange(e) {
        const { name, value } = e.target
        console.log(name, value)
        this.setState({
            [name]: value
        })
    }

    confirmRename(ele) {
        ele.preventDefault()
        console.log(`${this.state._id}`)
        fetch(`/api/audios/${this.state._id}`, {
            method: 'PATCH',
            body: JSON.stringify(
                {
                    name: this.state.newName
                }
            ),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.fetchAudios()
            this.setState({_id: '', newName: '', name: ''})
            M.toast({html: 'Edited!'})
        })
        .catch(err => console.log(err))

    }


    render() {

        const { recordState } = this.state
        
        let { _id } = this.state

        const renderEditButton = (e) => {
            if (_id == e._id) {
                return (
                    <form onSubmit={this.confirmRename}>
                        <button style={{ margin: '4px' }} type="submit" className="btn green"><i className="material-icons">check</i></button>
                    </form>

                )
            }
            return <button style={{ margin: '4px' }} onClick={() => this.renameAudio(e._id)} className="btn"><i className="material-icons">edit</i></button>
        }


        const renderEditField = (e) => {
             if (_id == e._id) return <input onChange={this.handleChange} value={this.state.newName} name="newName" type="text" placeholder="New Name" />
            return e.name
        }

        const renderRecorder = () => {
            return (

                                
                // <div>
                //     {/* <AudioReactRecorder state={recordState} onStop={this.onStop} /> */}

                //     <button className="btn" onClick={this.start}>Start</button>
                //     <button className="btn" onClick={this.stop}>Stop</button>
                // </div>

                <div className="holder" style={{margin: '30px 0 30px 0'}}>
                    <div data-role="controls" style={{margin: '30px 0 30px 0'}}>
                        <button className="btn red">Record</button>
                    </div>
                    <div data-role="recordings"></div>
                </div>
            )
        }

        const renderAudio = (audio) => {
            
            return <audio controls src={audio.audioFile}></audio>
        }

        const renderDate = (audio) => {
            let date = new Date(audio.date)
            let day = date.getDate()
            let month = date.getMonth()
            let year = date.getFullYear()
            let hours = date.getHours()
            let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
            let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`
            return <span>{`${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`}</span>
        }

        return (
                <div>
                {/* Navigation */}
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo" href="/">Audio Recorder</a>
                    </div>
                </nav>


                

                {/* <form onSubmit={this.test}> */}
                {/* <form action="/api/audios/upload" method="POST" encType="multipart/form-data">
                    <input name="name" type="text"></input>
                    <input name="audioFile" type="file"></input>
                    <button type="submit">go</button> */}
                    {/* <button type="submit" onClick={(e) => {e.preventDefault()}}>go</button> */}
                {/* </form> */}



                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                    <form onSubmit={this.addRecord}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input name="name" onChange={this.handleChange} value={this.state.name} type="text" placeholder="Audio Name" />
                                                {/* <input name="audioFile" onChange={this.handleChange} value={this.state.audioFile} type="file" placeholder="Upload audio" /> */}


                                            </div>
                                        </div>
                                        <button type="submit" className="btn darken-4">Add</button>
    
                                    </form>

                                </div>
                            </div>

                            <div className="card">
                                <div className="card-content">
                                    {renderRecorder()}
                                </div>

                            </div>

                            <div>
                                <button className="btn orange" onClick={() => this.reverseAudios()}>Reverse</button>
                            </div>

                            
                        </div>
                        <div className="col s7">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Audio</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.audios.map(audio => {
                                            return (
                                                <tr key={audio._id}>
                                                    <td>{renderEditField(audio)}</td>
                                                    
                                                    <td>{renderAudio(audio)}</td>
                                                    <td>{renderDate(audio)}</td>
                                                    <td>
                                                        {renderEditButton(audio)}
                                                        <button style={{ margin: '4px' }} onClick={() => this.deleteAudio(audio._id)} className="btn red"><i className="material-icons">delete</i></button>

                                                    </td>

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                        </div>


                    </div>
                </div>

                                    
            </div>

        )
    }
}

export default App