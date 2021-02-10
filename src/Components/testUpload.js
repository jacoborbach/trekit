import React, { Component } from 'react'
import axios from 'axios'
import { v4 as randomString } from 'uuid'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'

export class testUpload extends Component {
    constructor() {
        super();
        this.state = {
            isUploading: false,
            url: ''
        }
    }

    getSignedRequest = ([file]) => {
        this.setState({ isUploading: true })

        const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`

        axios.get('/sign-s3', {
            params: {
                'file-name': fileName,
                'file-type': file.type
            }
        }).then((response) => {
            const { signedRequest, url } = response.data
            this.uploadFile(file, signedRequest, url)
        }).catch(err => {
            console.log(err)
        })
    }

    uploadFile = (file, signedRequest, url) => {
        const options = {
            headers: {
                'Content-Type': file.type,
            },
        };

        axios
            .put(signedRequest, file, options)
            .then(response => {
                this.setState({ isUploading: false, url });
                // THEN DO SOMETHING WITH THE URL. SEND TO DB USING POST REQUEST OR SOMETHING
                console.log(response.data)
            })
            .catch(err => {
                this.setState({
                    isUploading: false,
                });
                if (err.response.status === 403) {
                    alert(
                        `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${err.stack
                        }`
                    );
                } else {
                    alert(`ERROR: ${err.status}\n ${err.stack}`);
                }
            });
    };




    render() {
        const { url, isUploading } = this.state;
        return (
            <div className="App">
                <h1>Upload</h1>
                <h1>{url}</h1>
                <img src={url} alt="" width="450px" />

                <Dropzone
                    onDropAccepted={this.getSignedRequest}
                    accept=".doc, .docx, image/png"
                    multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            style={{
                                position: 'relative',
                                width: 160,
                                height: 80,
                                borderWidth: 5,
                                marginTop: 25,
                                borderColor: 'gray',
                                borderStyle: 'dashed',
                                borderRadius: 5,
                                display: 'inline-block',
                                fontSize: 17,
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            {isUploading ? <GridLoader /> : <p>Upload File</p>}
                        </div>
                    )}
                </Dropzone>

            </div>
        )
    }
}

export default testUpload