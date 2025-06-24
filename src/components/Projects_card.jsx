//imports

//main function
const Projects_card = () => {



    return (
        <div>
            <div>
                <hr className="gradient-3"></hr>
                <h2>Meal Genie</h2>
                <hr className="gradient-3"></hr>
                <p>Meal Genie is an application/website that users can use to generate random meals using certain preferences they have set. You can view all ingedients and steps for these meals and even save them for later by logging in!</p>
                <h3>Tech Stack</h3>
                <ul>
                    <li>React JS</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Javascript</li>
                    <li>MongoDB & mongoose</li>
                    <li>Spoonacular API</li>
                </ul>
                <h3>Demo video</h3>
                <div className="demovideo">
                    <p>Demo video in production!</p>
                </div>
            </div>
            <div>
                <hr className="gradient-3"></hr>
                <h2>Bucketlist</h2>
                <hr className="gradient-3"></hr>
                <p>The Bucketlist webpage was something we used throughout most of the duration of the software development bootcamp, we built upon it to include backend functionalities from both mongoDB and SQL, and even practiced deploying through AWS!</p>
                <h3>Tech Stack</h3>
                <ul>
                    <li>React JS</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Javascript</li>
                    <li>MongoDB & mongoose</li>
                    <li>PostgreSQL</li>
                </ul>
                <h3>Demo video</h3>
                <div className="demovideo">
                    <iframe width="960" height="540"
                    src="https://www.youtube.com/embed/bgixueIm7kA">
                    </iframe>
                </div>
            </div>
            <div>
                <hr className="gradient-3"></hr>
                <h2>This Portfolio Site</h2>
                <hr className="gradient-3"></hr>
                <p>I have been using a lot of what I learned in making my portfolio mostly from scratch. I wanted to use what I knew, so I decided to use React in order to build my portfolio. I also was able to easily deploy this page using Github pages. There were a few issues I had to work out, but with what I've learned in my education, it wasn't difficult to figure out. </p>
                <h3>Tech Stack</h3>
                <ul>
                    <li>React JS</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Javascript</li>
                    <li>Github Pages</li>
                </ul>
                <h3>Demo video</h3>
                <div className="demovideo">
                    <p>Demo video in production!</p>
                </div>
                <p>Changelog page in production!</p>
            </div>
        </div>
    )
}

export default Projects_card;