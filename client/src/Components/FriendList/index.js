import React from 'react';
import {Link} from 'react-router-dom';

const FriendList = ({friendCount, username, friends}) => {

    if (!friends || !friends.length) {
        return <p className= 'text-center text-xl bg-white bg-opacity-50 rounded-lg p-2 mt-2'>{username}, you haven't added any friends yet.</p>;
    }

    return (
        <div>
            <h5> {username}'s {friendCount} {friendCount === 1 ? 'friend' : 'friends'} </h5>
        {friends.map(friend => (
            <button className= 'btn w-100 display-block mb-2' key= {friend._id}>
                <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
            </button>
        ))}
        </div>
    );
};

export default FriendList;