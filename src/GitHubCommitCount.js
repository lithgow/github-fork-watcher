import React from "react";
import * as GitHubApi from './GitHubApi'

class GitHubCommitCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: new GitHubApi.GitHubApiResponse()
        };
    }

    componentDidMount() {
        let firstCommitUrl = this.props.url.replace("{/sha}", "") + "?per_page=1";
        GitHubApi.get(firstCommitUrl)
            .then(response => {
                this.setState({apiResponse: response});
            })
    }

    render() {
        const { statusOk, isLoaded, json, error } = this.state.apiResponse;
        if (error) {
            console.log("Error getting " + this.props.url + " : " + error.message);
            return <div>!!!</div>;
        } else if (!isLoaded) {
            return <div>...</div>;
        } else if (!statusOk) {
            console.log("Error getting " + this.props.url + " : " + json.message);
            return <div>!!!</div>;
        } else {
            let linkHeader = this.state.apiResponse.headers.get('link');
            let matches = linkHeader.match(/(.*"next")(.*page=)([0-9]*)(.*"last")/);
            let numberOfCommits = matches[3];
            return (
                <span> {numberOfCommits}</span>
            );
        }
    }
}

export default GitHubCommitCount;