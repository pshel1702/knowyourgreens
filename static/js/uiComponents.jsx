
function Homepage(props) {
    const {isLoggedIn} = props;
    if (isLoggedIn){
        return (
            <div className="pageContents">
                <h1>Welcome!</h1>
                <h1>Know Your Greens</h1>
                <div>Care instructions for your green housemates.</div>
            </div>
        );
    }
    return (
            <div className="pageContents">
                <h1>Know Your Greens</h1>
                <div>Care instructions for your green housemates.</div>
            </div>
        );  
}


function NavigateToPlant(props){
    const {plant} = props;
    const history = ReactRouterDOM.useHistory();
    const onShowDetails = () => {
        history.push(`/plants/${plant.name}`) 
    }

    
    return(
        <div className="pageContents">
            <button onClick={onShowDetails}>View Details</button>
        </div>
    )
}

function AddToFavorites(props){
    const {plant} = props;
    

    return(
        <div className="pageContents">
            
            
        </div>
    )
}


function AllPlants(props) {
    const {isLoggedIn} = props;
    const [plants, getPlants] = React.useState({});
    
    React.useEffect(()=>{
        fetch('/api/all-plants')
        .then((response)=>response.json())
        .then((data)=>{
            getPlants(data);
        })
    },[]);

    const plantCards = [];
    for(const plant of Object.values(plants)){
        const plantCard = (
            <div className="plant-card">
                <PlantCard
                    key = {plant.plant_id}
                    name = {plant.name}
                    img = {plant.img}
                    isLoggedIn = {isLoggedIn}
                />
                <NavigateToPlant plant={plant} />  
            </div>
        );
        plantCards.push(plantCard);
    }

    return (
        <div className="pageContents">
            <h1>All Plants</h1>
            <div>{plantCards}</div>
        </div>
    );
}

function Favorites(){
    const [favs, getFavs] = React.useState({});
    const favoritePlants = [];
    React.useEffect(()=>{
        fetch('/api/show-favorites',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response)=> response.json())
        .then((data)=>{
            getFavs(data)
        })
    },[])  
    
    let favCard = null;
    console.log(favs)
    for(let fav in favs){
        for (const item of Object.entries(favs[fav])){ 
              favCard = (
                  <div>
                       <PlantCard
                          key= {fav}
                          name = {favs[fav]['name']}
                          img = {favs[fav]['img']}
                      />
                        <NavigateToPlant plant={favs[fav]} />
                  </div>
                  
                  )
          }
          favoritePlants.push(favCard)
      }
    return(
        <div className="pageContents">
            <div><h1>Favorites</h1></div>   
            <div>{favoritePlants}</div>
        </div>
    )
}


function AllVarietals(){
    const [parentPlant, setParentPlant] = React.useState({});
    const [plants, setPlants] = React.useState({});
    const {plantName} = ReactRouterDOM.useParams();
    let img='';

    React.useEffect(()=>{
        fetch('/api/results',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'plant_name': plantName
            })
        })
        .then((response)=>response.json())
        .then((data)=>{
            setPlants(data);
        })

    },[plantName])

    React.useEffect(()=>{
        fetch(`/api/plant/${plantName}`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'plantname': plantName
            })
        })
        .then((response)=>response.json())
        .then((data)=>{
            setParentPlant(data);
        })

    },[parentPlant])
    // if empty return loading state

     const varietalCards = [];
     let varietalCard=null;
     for(const [varietal,care] of Object.entries(plants)){
            varietalCard = (
                <VarietalCard
                    key={varietal.varietal_id}
                    name={varietal}
                    sunlight={care.Sunlight}
                    water={care.Water}
                    humidity={care.Humidity}
                    toxicity={care.Toxicity}
                    temperature={care.Temperature}
                />
            );
            varietalCards.push(varietalCard)
        }

     return(
         <div className="pageContents">
             <h1>{plantName}</h1>   
             <img src={parentPlant}></img>
             <div>{varietalCards}</div>
         </div>
     )

}

function VarietalCard(props){
    const {name,sunlight,water,humidity,toxicity,temperature} = props;
    return(
        <div>
            <h1>{name}</h1>
            <h2>Sunlight</h2>
            <div>{sunlight}</div>
            <h2>Water</h2>
            <div>{water}</div>
            <h2>Humidity</h2>
            <div>{humidity}</div>
            <h2>Toxicity</h2>
            <div>{toxicity}</div>
            <h2>Temperature</h2>
            <div>{temperature}</div>
        </div>
    )
}

function PlantCard(props){
    const {name,img, isLoggedIn} = props;
    const [favorite,setFavorite] = React.useState(false);
    console.log(favorite)

    const onAddToFavorites = (evt) => {
        evt.preventDefault();
        fetch('/api/add-favorites',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'plant': name, 
            })
        })
        .then((response)=> response.json())
         .then((data)=>{
            console.log("here")
            setFavorite(true)
         })
    }   

    const onRemoveFromFavorites = (evt) => {
        evt.preventDefault();
        fetch('/api/remove-favorite',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'plant': name, 
            })
        })
        .then((response)=> response.json())
         .then((data)=>{
            console.log("remove")
            setFavorite(false);
         }) 
    }

    return(
        <div className="plant-card">
            <h2>{name}</h2>
            <img src={img}/>
            
            {(isLoggedIn) && 
                favorite ? 
                <button onClick={onRemoveFromFavorites}>Remove from Favorites</button> :
                <button onClick={onAddToFavorites}>Add to Favorites</button>
                
            }
        </div>
    )
}

function PlantDetails(props) {
    
    //hook that gives params back from URL. key is the "plantName", value is whatever user puts in
    
    return(
         <AllVarietals results={plantName}/> 
    )
}

function SearchBar(props) {
    const [plant, searchPlant] = React.useState('');
    const history = ReactRouterDOM.useHistory();

    const handleInput = (evt) => {
        searchPlant(evt.target.value)
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        history.push(`/plants/${plant}`) 
    }
    
    return (
        <div className="pageContents">
            <div>Worried about your plants? Not sure how to care for your new green housemates?</div>
            
            <div>Enter a name to find out how to take care of your plants!</div>
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Plant Name" 
                    type="text" 
                    value={plant} 
                    name="plant_name" 
                    onChange={handleInput} required={true}/>
                <button type="submit">Search</button>
            </form>
            
        </div>
    );
}

function SignUp(props) {
    console.log(props)
    const {setUser} = props;
    const history = ReactRouterDOM.useHistory();
    const [state, setState] = React.useState({
        username : "",
        password : "",
        name : ""
    })
    
    const handleChange = (evt) => {
        const {id, value} = evt.target
        setState((prevState)=>({
            ...prevState,
            [id]:value
        }))
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        setUser(state.username,state.password,state.name)
        history.push('/')
    }
    return (
        <div className="pageContents">
            <h1>Sign Up</h1>
            <form onSubmit = {handleSubmit}>
                First Name<input type="name" id = "name" value={state.name} onChange={handleChange}/>
                Enter Username<input type="text" id="username" value={state.username} onChange={handleChange} />
                Password<input type="password" id="password" value={state.password} onChange={handleChange}/>
                <button type="submit">Sign up!</button>
            </form>
        </div>  
    );
}

function Login(props) {
    //change setUser to something else -> convention for useState
    const {setUser} = props;
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleUsername = (evt) => {
        setUsername(evt.target.value)
    }
    const handlePassword = (evt) => {
        setPassword(evt.target.value)
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setUser(username,password)
    }


    return(
        <div className="pageContents">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                Enter Username<input type="text" name="username" required={true} onChange={handleUsername} />
                Password<input type="password" name="password" required={true} onChange={handlePassword}/>
                <input type="submit"/>
                <div>New User?</div>
                <a href='/sign-in'>Sign up instead!</a>
            </form>
        </div>
    )
}


function Nav(props){
    const {isLoggedIn, logUserOut} = props;
    function onLogout(evt){
        evt.preventDefault();
        logUserOut()
    }
    return(
        <nav>
            <ReactRouterDOM.NavLink to="/">
                <div>Home</div>
            </ReactRouterDOM.NavLink>
            <ul className='nav-links'>
            <ReactRouterDOM.NavLink to="/all-plants">
                <li>All Plants</li>
            </ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/favorites">
                {isLoggedIn &&
                    (<li>My Favorites</li>)
                }
            </ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/logout" onClick = {onLogout}>
                {isLoggedIn &&
                    (<li>Logout</li>)
                }
            </ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/login">
                {!isLoggedIn && 
                    (<li>Login</li>)
                }
            </ReactRouterDOM.NavLink>
            <ReactRouterDOM.NavLink to="/sign-up">
                {!isLoggedIn && 
                    (<li>Sign Up</li>)
                }
            </ReactRouterDOM.NavLink>
            </ul>
        </nav>
    );
}
