import './styles.css';
import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { BlogContext } from "./context/BlogContext";
import AddComment from './components/AddComment';

function BlogDetails() {

    const { getDetailedBlogAndComments, connectedAccount, connectToMetamask } = useContext(BlogContext);
    const { address } = useParams();
    const [blogSummary, setBlogSummary] = useState({});
    const [blogComments, setBlogComments] = useState([]);

    useEffect(() => {
        const getDetails = async () => {
            const {formattedBlogDetails, formattedComments} = await getDetailedBlogAndComments(address);
            setBlogSummary(formattedBlogDetails);
            setBlogComments(formattedComments);
        }   
        if (address) {
            getDetails();
        }
    }, [address]);

    return (
    <>
        <main className="mb-4">
            <div className="container px-4 px-lg-5">
                <div className="d-flex justify-content-end">
                    {
                        !connectedAccount &&  
                            <div className="d-flex justify-content-end mt-2 mx-2 mb-4"><a className="btn btn-warning text-uppercase" onClick={connectToMetamask}>Connect Wallet</a></div>
                    }
                    <div className="d-flex justify-content-end mt-2 mb-4"><Link to='/' className="btn btn-secondary text-uppercase">Home</Link></div>
                </div>
                <article className="mb-4">
                    {
                        Object.keys(blogSummary).length !== 0 ? 
                            <>
                                <div className="container px-4 px-lg-5">
                                    <div className="row gx-4 gx-lg-5 justify-content-center">
                                        <div className="col-md-10 col-lg-8 col-xl-7">
                                            <h1 className="section-heading">{blogSummary.title}</h1>
                                            {/* <h4 className="subheading">This is the default sub heading.</h4> */}
                                            <span className="meta">
                                                <b>Posted by:</b>{' '}
                                                <a href="#!">{blogSummary.author}</a> <br></br>{' '}
                                                <b>on</b> {blogSummary.createdAt}
                                            </span>
                                            <blockquote className="blockquote mt-3">{blogSummary.description}</blockquote>
                                        </div>
                                    </div>
                                </div>
                            </> : <h3>Connect your account to see the detailed blog post, if it exists.</h3>
                    }
                </article>
                
                {Object.keys(blogSummary).length !== 0 && <AddComment blogAddress={address} />}

                <article className="mb-4 mt-2">
                    <h1>Comments</h1>
                    {
                        Object.keys(blogComments).length !== 0 ?
                        blogComments.map((comments, index) => {
                            return (
                                <div key={index}>
                                    <div className="container px-4 px-lg-5">
                                        <div className="row gx-4 gx-lg-5 justify-content-center">
                                            <div className="col-md-10 col-lg-8 col-xl-7">
                                                <h1 className="section-heading">{comments.title}</h1>
                                                <span className="meta">
                                                    <b>Posted by:</b>{' '}
                                                    <a href="#!">{comments.author}</a> <br></br>{' '}
                                                    <b>on</b> {comments.createdAt}
                                                </span>
                                                <blockquote className="blockquote mt-3">{comments.description}</blockquote>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <h6 className='lead text-dark'>We could not find any comments to this post.</h6>
                    }
                </article>

            </div>
        </main>
    </>
    );
}

export default BlogDetails;
