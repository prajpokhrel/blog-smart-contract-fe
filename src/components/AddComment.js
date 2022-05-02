import { useContext } from 'react';
import { BlogContext } from "../context/BlogContext";
import Loader from './Loader';

const AddComment = ({ blogAddress }) => {

    const { commentInputChangeHandler, loading, createComment } = useContext(BlogContext);

    const submitComment = (event) => {
        event.preventDefault();
        createComment(blogAddress);
    }

    return (
    <>
        <main className="mb-4">
            <div className="container px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <div className="my-5">
                        <form onSubmit={submitComment}>
                            <div className="form-group">
                                <label htmlFor="description">Add Comment</label>
                                <input onChange={commentInputChangeHandler} type="text" name="description" className="form-control" id="description" placeholder="Enter your description..." />
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

export default AddComment;
