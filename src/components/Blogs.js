import { BlogContext } from "../context/BlogContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Blog = () => {

    const { connectedAccount, blogs, connectToMetamask } = useContext(BlogContext);

    return (
        <div className="container px-4 px-lg-5">
            <div className="d-flex justify-content-end">
                {
                    !connectedAccount &&  
                        <div className="d-flex justify-content-end mt-2 mx-2 mb-4"><a className="btn btn-warning text-uppercase" onClick={connectToMetamask}>Connect Wallet</a></div>
                }
                <div className="d-flex justify-content-end mt-2 mb-4"><Link to='/create-blog' className="btn btn-primary text-uppercase">Create Blog →</Link></div>
            </div>
            <div className="row gx-4 gx-lg-5 justify-content-center">
                <div className="col-md-10 col-lg-8 col-xl-7">
                    {
                        connectedAccount ? 
                        <>
                            {
                                blogs.map((blog, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="post-preview">
                                                <Link to={`/blog-details/${blog.contractAddress}`}>
                                                    <h2 className="post-title">{ blog.title }</h2>
                                                    <h3 className="post-subtitle">This is a default subtitle.</h3>
                                                </Link>
                                                <p className="post-meta">
                                                    Posted by:{' '}
                                                    <a href="#!">{blog.author}</a>{' '}
                                                    on { blog.createdAt }
                                                </p>
                                            </div>
                                            <hr className="my-4" />
                                        </div>
                                    );
                                })
                            }
                        </> : <> <h3>Connect your account to see all the blog posts, if they exists.</h3> </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Blog;

