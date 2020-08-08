import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    GridList,
    GridListTile,
    TextField
} from "@material-ui/core";
export default class photoGrid extends React.Component {
  render() {
    const { photos } = this.props;
    return (
      <React.Fragment>
        <GridList cellHeight={160} cols={3}>
          {photos.map(photo => (
            <GridListTile key={photo.id} cols={1}>
              <img src={photo.media_url} alt="img" />
            </GridListTile>
          ))}


        </GridList>
      </React.Fragment>
    );
  }
}
