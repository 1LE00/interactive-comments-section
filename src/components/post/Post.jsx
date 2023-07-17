import { useRef } from 'react';
import Avatar from '../avatar/Avatar';
import Button from '../button/Button';
import Textarea from '../textarea/Textarea';
import updateCounter from '../../helper/updateCounter';
import apiRequest from '../../helper/apiRequest';

const Post = ({ currentUser, api, counter, setComments }) => {
    const textareaField = useRef(null);

    const handlePostSubmission = async (e) => {
        e.preventDefault();

        const textareaValue = textareaField.current.value.trim();
        if (textareaValue.length === 0) {
            textareaField.current.focus();
            return;
        }
        // get counter
        const counterResponse = await fetch(counter);
        const counterResult = await counterResponse.json();
        // generate postObject
        const postObject = {
            id: counterResult.id + 1,
            content: textareaValue,
            createdAt: new Date().toISOString(),
            score: 0,
            user: {
                image: {
                    png: currentUser.src.png,
                    webp: currentUser.src.webp
                },
                username: currentUser.username
            },
            replies: []
        }
        // send a post request
        const result = await apiRequest(api, 'POST', postObject);
        if (result.ok) {
            textareaField.current.value = '';
            textareaField.current.blur();
            setComments(prevComments => [...prevComments, postObject]);
            await updateCounter(counter, counterResult);
            // Scroll to the bottom of the page
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        }
    }

    return (
        <section className='post w-100'>
            <form action="" className='w-100 flex post-form' name='post-form' method='post' onSubmit={handlePostSubmission}>
                <section className="post-content form-content w-100">
                    <Textarea placeholder='Add a comment...' name='post' ref={textareaField} />
                </section>
                <section className="post-avatar avatar">
                    <Avatar src={currentUser.src.png} name={currentUser.username} />
                </section>
                <section className="btn-send btn-to-publish">
                    <Button type={true} text='SEND' name='send' />
                </section>
            </form>
        </section>
    )
}

export default Post