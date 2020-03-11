import React, { Component } from "react";
import Spinner from "./Spinner";
import Images from "./Image";
import Button from "./Button";

export default class App extends Component {
  state = {
    uploading: false,
    images: [],
    imgPreview: null
  };

  onChange = e => {
    const files = Array.from(e.target.files);
    // const file = Array.from(e.target.files[0]);

    const { type } = this.props;
    this.setState({ uploading: true });
    const formData = new FormData();

    files.forEach((file, i) => {
      this.setState({ imgPreview: file });
      formData.append(type, file, file.name);
    });

    fetch("/api/profile/uploadImg", {
      method: "POST",
      body: formData,
      onUploadProgress: progressEvent => {
        console.log(progressEvent.loaded / progressEvent.total);
      }
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res.user);
        this.setState({
          uploading: false,
          images: res.user
        });
      });
  };

  // removeImage = id => {
  //   this.setState({
  //     images: this.state.images.filter(image => image.public_id !== id)
  //   });
  // };

  render() {
    const { uploading, imgPreview, images } = this.state;

    const content = () => {
      switch (true) {
        case uploading:
          return <Spinner />;
        case imgPreview !== null:
          return (
            <Images images={images.avatar} removeImage={this.removeImage} />
          );
        default:
          return (
            <Button style={{ textAlign: "right" }} onChange={this.onChange} />
          );
      }
    };

    return (
      <div>
        <div className="buttons">{content()}</div>
      </div>
    );
  }
}
