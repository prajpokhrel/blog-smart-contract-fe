import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

import { contractAbi, contractAddress, blogContractAbi } from "../utils/constants";

export const BlogContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const blogFactoryContract = new ethers.Contract(contractAddress, contractAbi, signer);
    return blogFactoryContract;
}

const createBlogInstanceContract = (blogContractAddress) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const blogInstanceContract = new ethers.Contract(blogContractAddress, blogContractAbi, signer);
    return blogInstanceContract;
}

export const BlogProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [commentFormData, setCommentFormData] = useState({
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkWalletConnectivity();
        // connectToMetamask();
    }, []);

    const inputChangeHandler = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    const commentInputChangeHandler = (event) => {
        setCommentFormData({...commentFormData, [event.target.name]: event.target.value });
    }

    const createBlog = async (event) => {
        event.preventDefault();
        try {
            if(ethereum) {
                setLoading(true);
                const { title, description } = formData;
                const blogContract = createEthereumContract();

                const blogHash = await blogContract.createBlog(title, description);
                
                console.log(blogHash.hash);
                await blogHash.wait();
                setLoading(false);
                window.location.reload();
            } else {
                console.log("Ethereum object not found.");
                setLoading(false);
            }
        } catch(error) {
            setLoading(false);
            console.log(error);
            alert("No accounts found. Please connect your wallet.");
        }
    };

    const createComment = async (address) => {
        try {
            if (ethereum) {
                setLoading(true);
                const {description} = commentFormData;
                const blogContract = createBlogInstanceContract(`${address}`);
                const commentHash = await blogContract.createComment(description);
                await commentHash.wait();
                setLoading(false);
                window.location.reload();
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            alert("No accounts found. Please connect your wallet.");
        }
    };

    const checkWalletConnectivity = async () => {
        try {
            if(!ethereum) {
                return alert("Please install metamask.");
            }
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setConnectedAccount(accounts[0]);

                getAllBlogs();
            } else {
                console.log("No Accounts Found. Please connect your wallet");
                alert("No Accounts Found. Please connect your wallet.");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("Ethereum object is not found.");
        }
    }

    const connectToMetamask = async () => {
        try {
            if (!ethereum) {
                return alert("Please install metamask.");
            }
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setConnectedAccount(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error("Ethereum object is not found.");
        }
    }

    const getDetailedBlogAndComments = async (address) => {
        try {
            if (ethereum) {
                const blogContract = createBlogInstanceContract(`${address}`);
                const blog = await blogContract.getBlogDetails();
                const comments = await blogContract.getComments();

                const formattedBlogDetails = {
                    title: blog.title,
                    description: blog.description,
                    createdAt: new Date(blog.createdAt.toNumber() * 1000).toLocaleString(),
                    author: blog.author
                }

                const formattedComments = comments.map((comment) => {
                    return {
                        commentId: comment.commentId,
                        description: comment.description,
                        author: comment.author,
                        createdAt: new Date(comment.createdAt.toNumber() * 1000).toLocaleString()
                    };
                });
                return { formattedBlogDetails, formattedComments }; 
            }
        } catch(error) {
            console.log(error);
        }
    }

    const getAllBlogs = async () => {
        try {
            if(ethereum) {
                const blogFactoryContract = createEthereumContract();
                const getBlogs = await blogFactoryContract.getAllBlogs();

                const blogsSummary = await Promise.all(
                    getBlogs.map(async (blogAddress) => {
                        const blogContract = createBlogInstanceContract(blogAddress);
                        let getBlog = await blogContract.getBlogDetails();
                        getBlog = {...getBlog, blogContractAddress: blogAddress};
                        return getBlog;
                    })
                );
                
                const formattedBlogDetails = blogsSummary.map((blog) => {
                    return {
                        id: blog.blogId,
                        title: blog.title,
                        description: blog.description,
                        author: blog.author,
                        contractAddress: blog.blogContractAddress,
                        createdAt: new Date(blog.createdAt.toNumber() * 1000).toLocaleString()
                    }
                });
                setBlogs(formattedBlogDetails);
            }
        } catch(error) {
            console.log(error);
        }
    }   

    return (
        <BlogContext.Provider value={{ formData, loading, commentInputChangeHandler, createComment, getDetailedBlogAndComments, blogs, connectedAccount, createBlog, connectToMetamask, inputChangeHandler, connectedAccount }}>
            { children }
        </BlogContext.Provider>
    );
};

