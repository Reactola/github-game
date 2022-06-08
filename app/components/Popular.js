import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
function LanguagesNav({ selected, onUpdate }) {
    const languages = ["All", "Javascript", "Ruby", "Java", "CSS", "Python", "Go"]

    return (<ul className="flex-center">
        {languages.map((lang) => (
            <li key={lang}>
                <button className="btn-clear nav-link"
                    style={lang === selected ? { color: 'rgb(187, 46, 31)' } : null}
                    onClick={() => onUpdate(lang)}>
                    {lang}
                </button>
            </li>
        ))}
    </ul>)
}
LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired
}


function ReposGrid({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner

                return (
                    <li key={html_url} className="repo bg-light">
                        <h4 className='header-lg center-text'>
                            ${index + 1}
                        </h4>
                        <img className='avatar' src={avatar_url} alt={`Avatar for ${login}`} />

                        <h2 className='center-text'>
                            <a className='link' href={html_url}>{login}</a>
                        </h2>
                        <ul className="card-list">
                            <li>
                                <FaUser color="rgb(255, 191, 116)" size={22} />
                                <a href={`https://github.com/${login}`}>{login}</a>
                            </li>

                            <li>
                                <FaStar color="rgb(255, 215, 0)" size={22} />
                                {stargazers_count.toLocaleString()} stars
                            </li>

                            <li>
                                <FaCodeBranch color="rgb(129, 195, 245), 191, 116)" size={22} />
                                {forks.toLocaleString()} forks
                            </li>
                            <li>
                                <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                                {open_issues.toLocaleString()} open open_issues
                            </li>
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}
ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}
export default class Popular extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedLanguage: 'All',
            repos: {},
            error: null
        }
        this.updateLanguage = this.updateLanguage.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }
    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage)
    }
    updateLanguage(selectedLanguage) {
        this.setState({
            selectedLanguage,
            error: null,
        })
        //Improving for caching
        if (!this.state.repos[selectedLanguage]) {

            fetchPopularRepos(selectedLanguage).then((data) => {
                this.setState(({ repos }) => ({
                    repos: {
                        ...repos,
                        [selectedLanguage]: data
                    }
                }))
            })
                .catch(() => {
                    console.warn(`Error: fetching repos: `, error);

                    this.setState({
                        error: `there's was an error fetchin the repos`
                    })
                })
        }

    }
    isLoading() {
        // return this.state.repos === null && this.state.error === null
        const { error, repos, selectedLanguage } = this.state;

        return !repos[selectedLanguage] && error === null
    }
    render() {
        let { selectedLanguage, repos, error } = this.state;
        return (<>
            <LanguagesNav selected={selectedLanguage} onUpdate={this.updateLanguage} />


            {this.isLoading() && <p>Loading </p>}
            {error && <p>{error}</p>}
            {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
        </>)
    }
}