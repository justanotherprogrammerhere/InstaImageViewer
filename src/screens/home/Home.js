import React from "react";
import Header from "../../common/Header";
import {Avatar, Button, Card, CardContent, CardHeader, FormControl, Input, InputLabel} from "@material-ui/core";
import "./Home.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import properties from "../../common/Properties";

const API2 = 'https://graph.instagram.com/me/media?fields=id,caption&access_token=' + properties.accessToken;
const API5 = 'https://graph.instagram.com/'
const API6 = '?fields=media_type,media_url,username,timestamp&access_token=' + properties.accessToken;

const MANUAL_API1 = 'https://raw.githubusercontent.com/justanotherprogrammerhere/InstaImageViewer/master/Test/Data/all_posts.json'
const MANUAL_API2 = 'https://raw.githubusercontent.com/justanotherprogrammerhere/InstaImageViewer/master/Test/Data/'
const MANUAL_API3 = '/photo_details.json'
//import mainLogo from'./logoWhite.png';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            imagesData: [],
            filterImages: [],
            photos: [],
            photo_details: [],
            liked: false
        };
    }

    async componentDidMount() {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            window.location = "/";
            return;
        }

        //await fetch(API2)
        await fetch(MANUAL_API1)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data1 => this.setState({photos: data1.data, photosIsLoading: false}))
            //.then(json => console.log(json))
            .catch(error => this.setState({error, photosIsLoading: false}));

        await this.state.photos.map(photo =>
            //fetch(API5 + photo.id + API6)
            fetch(MANUAL_API2 + photo.id + MANUAL_API3)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong ...');
                    }
                })
                .then(data => {
                    if (data.media_url) {
                        data.caption = photo.caption
                        data.tags = '#testtag1 #testag2'
                        this.setState({
                            photo_details: [...this.state.photo_details, data], photoDetailsLoading: false
                        });
                    }
                })
                .catch(error => this.setState({error, photoDetailsLoading: false}))
        )

    }

    filterData = str => {
        const {imagesData} = this.state;
        if (imagesData) {
            const result = imagesData.filter(imageData =>
                imageData.caption.text.includes(str)
            );
            this.setState({filterImages: result});
        }
    };
    dateConvertor = timeStamp => {
        let newDate = new Date(timeStamp);
        let year = newDate.getFullYear();
        let monthNo = newDate.getMonth() + 1;
        let date = newDate.getDate();
        let hour = newDate.getHours();
        let min = newDate.getMinutes();
        let sec = newDate.getSeconds();
        hour = hour % 12;
        hour = hour || 12;
        min = min < 10 ? "0" + min : min;
        date = date < 10 ? "0" + date : date;
        monthNo = monthNo < 10 ? "0" + monthNo : monthNo;
        let time = hour + ":" + min + ":" + sec;
        let dateObj = {
            time: time,
            calSlashDate: date + "/" + monthNo + "/" + year.toString()
        };
        return dateObj.calSlashDate + " " + dateObj.time;
    };
    liked = id => {
        const {filterImages} = this.state;
        const likedImage = filterImages.filter(img => img.id === id);
        const updateFilterImages = filterImages.map(img => {
            var returnValue = {...img};
            if (img.id === likedImage.id) {
                returnValue["liked"] = true;
            }
            return returnValue;
        });
        console.log(updateFilterImages);
    };

    render() {
        const {photos, photo_details} = this.state;
        return (
            <React.Fragment>
                <div>
                    <Header
                        homepageHeader={true}
                        onFilter={this.photo_details}
                    />
                    <div className="card-wrapper">
                        {photo_details && photo_details.length > 0 ? photo_details.map(img => (
                                <Card className="card" key={img.id}>
                                    <CardContent>
                                        <div className="content">
                                            {console.log(img.media_url)}
                                            <img src={img.media_url}
                                                 alt="post-photo"
                                                 className="post-photo"/>
                                            <hr/>
                                            {img.caption ?
                                                <div className="caption"> {img.caption}</div> :
                                                <div className="caption"> &nbsp;</div>}


                                            <FormControl
                                                fullWidth={true}
                                                margin="normal"
                                                className="comment-form">
                                                <InputLabel htmlFor="comment">Add a comment</InputLabel>
                                                <Input className="comment-input"/>
                                                <Button variant="contained" color="primary"> ADD </Button>
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                            : null}

                    </div>


                    <div>
                        <ul>
                            <div id={photos.size}>
                                {photos.map(photo =>
                                    <li key={photo.id} id={photo.id}>
                                        <div>{photo.id} {photo.caption}</div>
                                    </li>
                                )}</div>
                            <br/>
                            <br/>
                            <div>
                                {photo_details.map(detail =>
                                    <li key={detail.id} id={detail.id}>
                                        <div>{detail.id} {detail.username} {detail.caption}</div>
                                    </li>
                                )}</div>
                        </ul>
                    </div>


                </div>
            </React.Fragment>
        );
    }
}
