export const IS_EXISTS_USER = `
    query isExistsEmail($email: String!) {
        users(where: { email: { _eq: $email } }) {
            id
        }
    }
`;

export const INSERT_USER_MUTATION = `
    mutation insertUser($input: users_insert_input!) {
        insert_users_one(object: $input) {
            id
            email
        }
    }
`;

export const LOGIN_QUERY = `
    query Login($email: String!) {
        users(
            where: { 
                email: { 
                    _eq: $email 
                },
            },
            limit: 1
        ) {
            id
            email
            password
        }
    }
`;
