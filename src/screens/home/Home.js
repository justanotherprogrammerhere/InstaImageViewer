import React from "react";
import Header from "../../common/Header";
import {
    Avatar,
    Button,
    Card,
    IconButton,
    CardContent,
    CardHeader,
    FormControl,
    Input,
    InputLabel
} from "@material-ui/core";
import "./Home.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import properties from "../../common/Properties";

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            photoDetails: [],
            photoDetailsUnAltered: [],
            profilePhoto: properties.profilePhoto,
            comment: null,
            comments: [],
            commentForImage: [],
            likedByUser: [],
            searchOn: false,
            userLiked: false
        };
    }

    async componentDidMount() {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            window.location = "/";
            return;
        }

        //await fetch(properties.photosListApi + accessToken)
        await fetch(properties.photosListApi)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data1 => this.setState({photos: data1.data, photosIsLoading: false}))
            .catch(error => this.setState({error, photosIsLoading: false}));


        await this.state.photos.map(photo =>
            //fetch(properties.photoDetailsApi1 + photo.id + properties.photoDetailsApi2 + accessToken)
            fetch(properties.photoDetailsApi1 + photo.id + properties.photoDetailsApi2)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong ...');
                    }
                })
                .then(data => {
                    if (data.media_url) {
                        if(photo.caption !== "" || photo.caption !== null || photo.caption !== "undefined")
                            data.caption = photo.caption;
                        else if( photo.caption === "undefined")
                            data.caption = "";

                        //Manually creating likes
                        data.likes = Math.floor(Math.random() * 100);
                        data.tags = '#testtag1 #testag2';
                        this.setState({
                            photoDetails: [...this.state.photoDetails, data], photoDetailsLoading: false
                        });
                    }
                })
                .catch(error => this.setState({error, photoDetailsLoading: false}))
        )


    }


    dateConvertor = timeStamp => {
        var resTs = timeStamp.replace('/-', '//');
        resTs = resTs.replace('T', ' ');
        resTs = resTs.replace('+', ' ');
        resTs = resTs.slice(0, resTs.length - 4);
        return resTs;

    };

    loadPost = (index) => {
        this.state.likedByUser[index] = false;
        this.forceUpdate();
    };

    filterPhotos = str => {
        const {photoDetails, searchOn} = this.state;
        if (searchOn === false) {
            if (str !== "" || str !== null) {
                this.setState({photoDetailsUnAltered: this.state.photoDetails});
                this.setState({searchOn: true});
            }
        } else {
            if (str === "" || str === null) {
                this.setState({photoDetails: this.state.photoDetailsUnAltered});
                this.setState({searchOn: false});
                return;
            }
        }

        if (photoDetails) {
            const result = photoDetails
                .filter(imageData =>
                    imageData.caption.includes(str))
                .map(imageData => imageData);
            this.setState({photoDetails: result});
        }
    };

    likeBtnHandler = (imageId) => {
        var i = 0;
        var imageArray = this.state.photoDetails;
        for (i; i < imageArray.length; i++) {
            if (imageArray[i].id === imageId) {
                if (imageArray[i].userLiked === true) {
                    imageArray[i].userLiked = false;
                    imageArray[i].likes--;
                    this.setState({
                        images: imageArray
                    });
                    break;
                } else {
                    imageArray[i].userLiked = true;
                    imageArray[i].likes++;
                    this.setState({
                        images: imageArray
                    });
                    break;
                }
            }
        }
    };

    commentHandler = (event, index) => {
        this.setState({comment: event.target.value});
        this.state.commentForImage[index] = event.target.value;
        this.forceUpdate();
    };

    addCommentHandler = (index) => {
        if (this.state.comment !== null && this.state.comment !== "") {
            if (this.state.comments[index] === undefined)
                this.state.comments[index] = this.state.comment;
            else
                this.state.comments[index] = this.state.comments[index] + ":" + this.state.comment;
            this.forceUpdate();

            this.setState({comment: ''});
            this.state.commentForImage[index] = "";
            this.forceUpdate();

        }
    };

    render() {
        const {photos, photoDetails, profilePhoto} = this.state;
        return (
            <React.Fragment>
                <div>

                    <Header
                        homepageHeader={true}
                        onFilter={this.filterPhotos}
                    />
                    <div className="photo-wrapper">
                        {photoDetails && photoDetails.length > 0 ? photoDetails.map((imgDetail, index) => (
                                <Card className="photo" key={imgDetail.id}>

                                    <CardHeader
                                        avatar={
                                            <Avatar aria-label="recipe">
                                                <img src={this.state.profilePhoto}
                                                     alt="user"
                                                     className="profile-pic"
                                                />
                                            </Avatar>
                                        }
                                        title={imgDetail.username}
                                        subheader={this.dateConvertor(imgDetail.timestamp)}
                                    />

                                    <CardContent>
                                        <div className="content">
                                            <img src={imgDetail.media_url}
                                                 alt="post-photo"
                                                 className="post-photo"/>
                                            <hr/>

                                            {imgDetail.caption ?
                                                <div className="caption"> {imgDetail.caption}</div> :
                                                <div className="caption"> &nbsp;</div>}
                                            <span className={"small-padding"}></span>

                                            <div>
                                                <IconButton className="like-button" aria-label="like-button"
                                                            onClick={() =>
                                                                this.likeBtnHandler(imgDetail.id)}> {imgDetail.userLiked ?
                                                    <FavoriteIcon className="image-liked-icon" fontSize="large"
                                                                  color="secondary"/> :
                                                    <FavoriteBorderIcon className="image-like-icon" fontSize="large"/>}
                                                </IconButton>
                                                {imgDetail.likes === 1 ?
                                                    <span> {imgDetail.likes} like </span> :
                                                    <span> {imgDetail.likes} likes </span>
                                                }
                                            </div>
                                            <span className={"small-padding"}></span>
                                            <div className="comment-container medium-padding">
                                                {this.state.comments[index] !== undefined && this.state.comments[index] !== null ?
                                                    this.state.comments[index].split(':').map(
                                                        comment => (<div key={imgDetail.id}>
                                                            <span className="text-bold">{imgDetail.username} : </span>
                                                            <span>{comment}</span><br/>
                                                        </div>)) : ""}

                                                <FormControl>
                                                    <div className="comment-section">
                                                        <InputLabel htmlFor={"comment" + imgDetail.id}>Add a
                                                            comment</InputLabel>
                                                        <Input key={"comment" + imgDetail.id} type="text"
                                                               value={this.state.commentForImage[index]}
                                                               comment={this.state.comment} onChange={(e) => {
                                                            this.commentHandler(e, index)
                                                        }}/>
                                                        <Button variant="contained" color="primary"
                                                                onClick={() => this.addCommentHandler(index)}>
                                                            ADD
                                                        </Button>

                                                    </div>
                                                </FormControl>

                                            </div>


                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                            : null}

                    </div>

                </div>
            </React.Fragment>
        );
    }
}
