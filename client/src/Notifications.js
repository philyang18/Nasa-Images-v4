import { store } from 'react-notifications-component';

export function addPhotoNotification(props) {
    const { id } = props;
    store.addNotification({
        id: id,
        title: "ADDED",
        message: "Added photo to favorites!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 750,
          onScreen: true
        }
    });
}

export function removePhotoNotification(props) {
    const { id } = props;
    store.removeNotification(id);
    store.addNotification({
        id: id,
        title: "REMOVED",
        message: "Removed photo to favorites!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 750,
            onScreen: true
        }
    });
}

export function updateCommentNotification(props) {
    const { id } = props;
    store.addNotification({
        id: id,
        title: "UPDATED",
        message: "Updated comment!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 750,
          onScreen: true
        }
    });
}
export function deleteCommentNotification(props){
    const { id } = props;
    store.addNotification({
        id: id,
        title: "DELETED",
        message: "Deleted comment!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 750,
          onScreen: true
        }
    });
}

export function updatePasswordNotification(props) {
    const { id } = props;
    store.addNotification({
        id: id,
        title: "UPDATED",
        message: "Updated password!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 750,
          onScreen: true
        }
    });
}