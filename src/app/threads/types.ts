export const types = `#graphql 
   input CreateThreadData {
      content: String!

   }

   type Thread {
    id : ID!
    content : String
    author: User
 
 }
`;
