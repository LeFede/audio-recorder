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
            audios: [],
            _id: '',
            newName: '',
            adding: false,
            //recording: false,
            search: '',
            searchedAudios: [],
        }

        //Preguntar: quise hacer las funciones anónimas pero daba error, por ende tuve que bindear de esta manera
        this.addRecord = this.addRecord.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.confirmRename = this.confirmRename.bind(this)
        this.reverseAudios = this.reverseAudios.bind(this)
        this.handleSearch = this.handleSearch.bind(this)

    }


    addRecord(e) {

        e.preventDefault()
        if (!this.state.name) return
        if (document.querySelector('#recorded-audio') == null) return M.toast({html: 'Please record something!'})

        this.setState({adding: true})
        let blobUrl = document.querySelector('#recorded-audio').src
        let file

        fetch(blobUrl)
            .then(res => res.blob())
            .then(blob => {
                
                file = new File([blob], `${this.state.name}.wav`)
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

                    document.querySelector('[data-role=recordings]').innerHTML = ''
                    this.state.adding = false
                    this.fetchAudios()

                })

            })

    }

    componentDidMount() {
        this.fetchAudios()
    }

    fetchAudios() {
        fetch('/api/audios')
            .then(res => res.json())
            .then(data => {
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

    clickedRecordButton(){
        document.querySelector('[data-role=recordings]').innerHTML = ''
    }

    handleSearch(e){
        e.preventDefault()
        if (this.state.search == '') {
            M.toast({html: `Showing Everything!`})
            return this.fetchAudios()
        }

        fetch(`/api/audios/search/${this.state.search}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ audios: data })


                M.toast({html: `Current search: "${this.state.search}"`})

                this.setState({
                    search: ''
                })

            })
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
            if (true) 
                return <button className="btn red" onClick={() => {this.clickedRecordButton()}}>Record</button> 

            return <button className="btn red">Recording...</button>  
            
        }

        const renderAddButton = () => {
            if (this.state.adding == true)
                return <div><button type="submit" disabled className="btn green darken-4">Adding</button></div>
            
            return <div><button type="submit" className="btn darken-4">Add</button></div>
            
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
                                        {renderAddButton()}
    
                                    </form>

                                </div>
                            </div>

                            <div className="card">
                                <div className="card-content">

                                <div className="holder" style={{margin: '30px 0 30px 0'}}>
                                    <div data-role="controls" style={{margin: '30px 0 30px 0'}}>
                                    {renderRecorder()}

                                    </div>
                                        <div data-role="recordings"></div>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <button className="btn orange" onClick={() => this.reverseAudios()}>Reverse</button>
                            </div>

                            
                        </div>
                        <div className="col s7">
                            <div>
                                <form onSubmit={this.handleSearch}>
                                    <input placeholder="Search audio by name" name="search" onChange={this.handleChange} value={this.state.search} type="text" />
                                    
                                    
                                </form>
                            </div>
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