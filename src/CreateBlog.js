import './styles.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { BlogContext } from "./context/BlogContext";
import Loader from './components/Loader';

function CreateBlog() {

    const { loading, connectedAccount, createBlog, connectToMetamask, inputChangeHandler, connectedAccounts } = useContext(BlogContext);

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
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <h1>Create your blog</h1>
                        <p>Want to get in the world of Web 3.0? Create your first blog and get started!</p>
                        <div className="my-5">
                        <form onSubmit={createBlog}>
                            <div className="form-group mb-5">
                                <label htmlFor="title">Title</label>
                                <input onChange={inputChangeHandler} type="text" name="title" className="form-control" id="title" placeholder="Enter your blog title..." />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input onChange={inputChangeHandler} type="text" name="description" className="form-control" id="description" placeholder="Enter your description..." />
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">
                                Create {loading && <Loader />}
                            </button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
    );
}

export default CreateBlog;
