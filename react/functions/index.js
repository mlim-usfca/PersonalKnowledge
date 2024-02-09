const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = {
    "type": "service_account",
    "project_id": "dragonai-auth",
    "private_key_id": "51a2ccbbe70d306ceebfc06db1c945a776ec415e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC6I+e9GKcBRdLu\nlDBHPv8LFHuM2wTAJGPaIPnQlHMXW6cw2gKboJLhm6FP9cvRZTVSkKsr5O4aT6OY\nketsnU/HGwfNMbt5gVRfAIFNB/3m9FW/neqVWChldivbq31AO8Mjt3ey01DHH7iH\n6HbJx3CRvizCfjemmcbnNJzvxoIqFHhgYH40jS1ehN6WWdFI87MR0Th0Y9SOOeaN\nOo9jcQ0BsTyHy13H036NuZ1i3JsBcCU0cbT/6eKwpkQdhmxXD8c5juHQUolkM1mJ\nxdS6WvFIYShDLk2QHVJ6jQOXLhzhw1JcCy1Xa5x+fLKnkQOIJDhOoZSoStxa8UMK\nWrHyzZflAgMBAAECggEAEtvwbshAo3BfnqyE97L6RDUfD3ZhVNZbB46vwOJJhuRS\nXDC6cuoh95m9DkzpCZ4neOYPcbMQLLpE6QBfyfFmU9X5RGD1jan80mNKtnNI1k2L\nIo7tZZQ5A46lguwtFIT5kHTWO9gNJx+foqV645bBYQLTpiEDom2SKXq7K9ABACJG\nEXiRVwFBailfQoergvVJWQYtKtQ48JO9OqBsdKGi4zTz+HQJr2yDIiX5lxyfn0aB\nJ1tQ62c26gjypAh85Z2qPY2O4nwJpHc978Ha8pHL1XBzCxDp7V84KUnIxgCI8HeS\nfnTCI3wlnGqZYDxjAQVSEBNxNKmWS3lSeLct6aH/QQKBgQD+DdNNg1gW6BkfbfzG\nLtFfn8EIsnlt7NQrwTGBkIe20gr48KaBjwJzmrWQi6CXI+qelOz86qpxBmr1F6km\nX9/mIn0i5CBizvgCwojxW1pIIRMiXK0GeKikcSbRYMG5R5/1IYxfgQPa4tmYjlIo\nMf/0dUOjxQwIvm2WWNEx+fV5KwKBgQC7kOhg0wj3LdTeKLaQjXUg7XR/S2xqJYj5\nx87Ln8j4PE0ojFk2JrBADTChAFMySdqjFNv+w4H58csqvn7bUhOCRuJiZBBfULm0\nRbQl0nt6nAk5RfeGFATQQNeeyhzanm+92CJAQc5sJmyYI4KWWOexcYVe/padv7DI\n/agWdNaLLwKBgQCobBP0JCnm7bGSA4F7BRiqsybulBsqQ8IYy7f9NAq0qaS6ihdo\ndp1idGL/04EAEcB9py9BMHUT/vQzTZ9GoHK3h4+77M6HkrwaYEsW7r/4Z2ze79+J\nFb5/XcAlOGbVZOVnRflgaxBaMN+eYmOW4CbWMlNII96pgUz3SiRNZG9XBwKBgQCF\nI79Pu31Jt8a6S7wLr93MmcFv+mHilvI8G5C3CZzmWCeM+NL6lUvWq4YxQsHLmJER\n4eSnWrAQc4n7tWzm0cP3XcmkfdMBVZP8Wt4dWuM7jTce6INjMSKZkO19UYpZxM0c\nvSbS5eNY8Y10EQDJKCKO2j4JyD2xjDg485U1G4qPEQKBgQD3dlbQ/CZZFq7EdXmy\nPyulHxoY3w0moigssaqV5MP0BPhtHVfpCY0ADVPzdSmGTrcgVY6c9mIjzi/bz6NJ\n26AkzPdfsi/3WDT0henLyLbID5qmz/QgdgvqJ4UnuPbg1vFoc2u6W0n7+qOfAdW1\nPeiKljJDCaR6oVGLVnVz+1EOEg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-27h1y@dragonai-auth.iam.gserviceaccount.com",
    "client_id": "115266202306544005119",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-27h1y%40dragonai-auth.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  ;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dragonai-auth-default-rtdb.firebaseio.com"
});
// On sign up.
exports.processSignUp = functions.auth.user().onCreate(user => {
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-user-id": user.uid
    }
  };

  // Set custom user claims on this newly created user.
  return admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .then(() => {
      // Update real-time database to notify client to force refresh.
      const metadataRef = admin.database().ref("metadata/" + user.uid);
      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      return metadataRef.set({ refreshTime: new Date().getTime() });
    })
    .catch(error => {
      console.log(error);
    });
});