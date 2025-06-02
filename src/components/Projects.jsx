//imports
import Projects_card from "../components/Projects_card";




//main function
const Projects = () => {


return (
    <div>
        <div className="header-container">
        <h1>These are some projects I've worked on</h1>
        <hr className="gradient-2"></hr>
        </div>
        <p>These are a few projects that I've worked on recently.</p>

            <Projects_card/>

                {/* potentially make a dropdown for each project, with seperate pages on them.
                on separate pages, provide screenshots of projects, maybe link to source code on github in case people want to see that. */}

    </div>
    );
};

export default Projects;