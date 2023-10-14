import { useEffect, useState } from "react";
import {useNavigate,} from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import {CiMenuFries} from 'react-icons/ci'
import {AiOutlineClose} from 'react-icons/ai'
const Blogs = () => {
    const [GetBlogs, SetBlogs] = useState([]);
    const [GetStats, SetStats] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showStats,SetShowStats]=useState(false);
    
    const navigate=useNavigate();
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery) {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/blog-search',
                    {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            searchQuery: searchQuery
                        })
                    }
                );
                if (response.status === 500) {
                    navigate('/error',{state:{id:1,name:'Error 500',message:'Server Not Responding ❌'}});
                }
                if (response.status === 404) {
                    navigate('/error',{state:{id:1,name:'Error 404',message:'Unable to Search Check API url ❌'}});
                } else {
                    const data = await response.json();
                    console.log(data)
                    setSearchResults(data);
                }
            } catch (error) {
                <Navigate to='/error' replace={true}/>
            }
        }
        if (searchQuery === '') {
            try {
                const response = await fetch("http://localhost:5000/api/blog-stats", {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        accept: "application/json",
                    },
                });
                if (response.status === 500) {
                    navigate('/error',{state:{id:1,name:'Error 500',message:'Server Not Responding ❌'}});
                }
                if (response.status === 404) {
                    navigate('/error',{state:{id:1,name:'Error 404',message:'Unable to Search Check API url ❌'}});
                } else {
                    const data = await response.json();
                    SetBlogs(data.blogs);
                    setSearchResults(data.blogs)
                    SetStats(data.stats);
                    console.log("Data read");
                    console.log(data.stats);
                }
            } catch (error) {
                navigate('/error',{state:{id:1,name:'Error 401',message:'Not Authorized to Search Blogs ❌'}});

            }

        }
    };

    const getData = async (e) => {
        try {

            const response = await fetch("http://localhost:5000/api/blog-stats", {
                method: "GET",
                mode: "cors",
                headers: {
                    accept: "application/json",
                },
            });
            if (response.status === 500) {
                navigate('/error',{state:{id:1,name:'Error 500',message:'Server Not Responding ❌'}});
            }
            if (response.status === 404) {
                navigate('/error',{state:{id:1,name:'Error 404',message:'Blogs Not Found Check API URL❌'}});
            } else {

                const data = await response.json();
                SetBlogs(data.blogs);
                SetStats(data.stats);
                console.log("Data read");
                console.log(data.stats);
                
            }
        } catch (error) {
            navigate('/error',{state:{id:1,name:'Error 401',message:'Not Authorized to View Blogs ❌'}});
            
        }
    };

    getData();


    return (
        <>
            <div className="stats">
                <div className="search_menu">
                <div className="search-form">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search">Search</button>
                    </form>
                </div>
                <button className="menu" onClick={()=>{SetShowStats(!showStats)}}>
                Show Stats {showStats?<AiOutlineClose/>:<CiMenuFries/>}</button>

                </div>
                {showStats && (
                    <div>
                        <div className="stats_data">
                            <p><span>Total Blogs</span> = {GetStats.total_blogs}</p>
                            <p><span>Longest Title 👇</span></p>
                            <div className="longest_title">
                                {GetStats.longest_title.title}
                            </div>
                            <p><span>Word "Privacy" Occurrence</span> = {GetStats.privacy_count}</p>
                        </div>
                        <h1 style={{ "textAlign": "center" }}>Unique Titles 👇</h1>
                        <div className="unique-titles">
                            {GetStats.uniqueTitles && (
                                <div className="title-row">
                                    {GetStats.uniqueTitles.map((title, id) => (
                                        <div className="title1" key={id}>
                                            {title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
            <h1 style={{ "textAlign": "center" }}>All Blogs 👇</h1>
            {searchResults.length > 0 ? (
                <div className="blogs">
                    {
                        searchResults.map((blog, id) => (
                            <div className="blog" key={id}>
                                <div className="image">
                                    <img src={blog.image_url} alt={blog.title} />
                                </div>
                                <div className="title">{blog.title}</div>
                            </div>
                        ))
                    }

                </div>
            ) : (
                <div className="blogs">
                    {
                        GetBlogs.map((blog, id) => (
                            <div className="blog" key={id}>
                                <div className="image">
                                    <img src={blog.image_url} alt={blog.title} />
                                </div>
                                <div className="title">{blog.title}</div>
                            </div>
                        ))
                    }

                </div>
            )}
        </>
    );
};

export default Blogs;
