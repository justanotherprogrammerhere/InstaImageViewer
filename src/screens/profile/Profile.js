import React from "react";
import Header from "../../common/Header";
import {
    Avatar,
    Fab,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    TextField
} from "@material-ui/core";
import "./Profile.css";
import properties from "../../common/Properties";
import EditIcon from "@material-ui/icons/Edit";
import ImageGrid from "./imageGrid";

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            photoDetails: [],
            profilePhoto: properties.profilePhoto,
            username: "",
            counts: {},
            fullName: properties.fullName,
            updatedFullname: "",
            emptyFullname: false,
            openModal: false,
            numUsersFollowed: 20,
            numUsersFollowedBy: 50
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
                        if (photo.caption !== "" || photo.caption !== null || photo.caption !== "undefined")
                            data.caption = photo.caption;
                        else if (photo.caption === "undefined")
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

    openModal = () => {
        this.setState({openModal: true});
    };

    closeModal = () => {
        this.setState({openModal: false});
    };

    handleChange = (e, type) => {
        const value = e.target.value;
        const nextState = {};
        nextState[type] = value;
        this.setState(nextState);
    };

    updateFullname = () => {
        const {updatedFullname} = this.state;
        if (updatedFullname.trim() !== "") {
            this.setState({
                fullName: updatedFullname,
                openModal: false,
                emptyFullname: false,
                updatedFullname: ""
            });
        } else {
            this.setState({emptyFullname: true});
        }
    };

    render() {
        const {photos, photoDetails, profilePhoto, counts, openModal, emptyFullname, numUsersFollowedBy, numUsersFollowed} = this.state;
        return (
            <React.Fragment>

                <div>
                    {console.log(photos)}
                    {console.log(photoDetails)}
                    <div className="profile-wrapper">
                        <Header url={profilePhoto} homepageHeader={true} goToHome={true}/>
                        <div className="information-section">
                            <Avatar aria-label="recipe">
                                <img src={profilePhoto} alt="profile-pic" className="profile-pic"/>
                            </Avatar>
                            <div className="user-info">
                                <p className="username">{properties.username}</p>
                                <div className="posts-info">
                                    <p>Posts: {this.state.photoDetails.length}</p>
                                    <p>Follows: {this.state.numUsersFollowed}</p>
                                    <p>Followed By: {this.state.numUsersFollowedBy}</p>
                                </div>
                                <div>
                                    <span className="fullname">{this.state.fullName}</span>
                                    <Fab
                                        color="secondary"
                                        aria-label="edit"
                                        className="edit-btn"
                                        onClick={this.openModal}>
                                        <EditIcon/>
                                    </Fab>
                                    <div>
                                        <Dialog
                                            open={openModal}
                                            onClose={this.closeModal}
                                            aria-labelledby="form-dialog-title"
                                            className="update-modal">
                                            <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    margin="dense"
                                                    id="fullname"
                                                    label="Full Name *"
                                                    type="email"
                                                    fullWidth
                                                    onChange={e => this.handleChange(e, "updatedFullname")}/>
                                                {emptyFullname ? (<span className="error">required</span>) : null}
                                            </DialogContent>
                                            <DialogActions>
                                                <Button
                                                    onClick={this.updateFullname}
                                                    color="primary"
                                                    variant="contained">
                                                    Update
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="img-grid">
                            <ImageGrid photos={photoDetails}/>
                        </div>
                    </div>


                </div>

            </React.Fragment>
        );
    }
}
