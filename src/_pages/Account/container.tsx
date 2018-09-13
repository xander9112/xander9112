import {connect} from "react-redux";
import styledPage from "./component";

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({
    // deleteGroup: (group) => dispatch(groupActions.deleteGroup(group))
});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(styledPage);
export {connectedPage as AccountPage};
