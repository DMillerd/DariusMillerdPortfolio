//imports

//main function
const Proficiencies = () => {



    return (
        <div>
            <div className="header-container">
            <h1>Here are my Proficiencies</h1>
            <hr className="gradient-2"></hr>
            </div>
            <p>These would be from the different coding languages I know, to what tools I hae used in the past in previous projects.</p>

            <h2>Front End</h2>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>Javascript & NodeJS</li>
                <li>React JS</li>
            </ul>
            <h2>Back End</h2>
            <ul>
                <li>MongoDB and mongoose</li>
                <li>SQL & PostgreSQL</li>
                <li>AWS</li>
                <li>Github and Github pages</li>
            </ul>
            <h2>Other</h2>
            <ul>
                <li>Project management tools such as Trello</li>
                <li>Testing code with Jest</li>
                <li>Github Copilot</li>
            </ul>

        </div>
    );
};

export default Proficiencies;