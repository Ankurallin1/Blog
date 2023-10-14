import {useLocation} from 'react-router-dom';

 function ComponentB() {

    const location = useLocation();
    console.log(location.state)
        return (

            <>
               
            <div className='error'>
            <h1>{location.state.name}</h1>
            <p>{location.state.message}</p>

            </div>

            </>
        )
    }

export default ComponentB;