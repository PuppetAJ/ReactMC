import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

// export const DELETE_FRIEND = gql`
//   mutation deleteFriend($friendId: ID!) {
//     deleteFriend(friendId: $friendId)
//   }
// `

export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!, $build: String) {
    addThought(thoughtText: $thoughtText, build: $build) {
      _id
      thoughtText
      createdAt
      build
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;

export const DELETE_THOUGHT = gql`
  mutation deleteThought($thoughtId: ID!) {
    deleteThought(thoughtId: $thoughtId)
  }
`;

export const ADD_BUILD = gql`
  mutation addBuild($buildData: String!) {
    addBuild(buildData: $buildData) {
      username
      savedBuilds
    }
  }
`;
