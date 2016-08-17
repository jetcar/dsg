function run() {
    if (!getAccessToken()) {
        // The following code looks for a fragment in the URL to get the access token which will be
        // used to call the protected Web API resource
        var fragment = getFragment();

        if (fragment.access_token) {
            // returning with access token, restore old hash, or at least hide token
            window.location.hash = fragment.state || '';
            setAccessToken(fragment.access_token);
        } else {
            // no token - so bounce to Authorize endpoint in AccountController to sign in or register
            window.location = "/token";
        }
    }
}


function setAccessToken (accessToken) {
    sessionStorage.setItem("accessToken", accessToken);
};

function getAccessToken() {
    return sessionStorage.getItem("accessToken");
};


function getFragment() {
    if (window.location.hash.indexOf("#") === 0) {
        return parseQueryString(window.location.hash.substr(1));
    } else {
        return {};
    }
};

function parseQueryString(queryString) {
    var data = {},
        pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

    if (queryString === null) {
        return data;
    }

    pairs = queryString.split("&");

    for (var i = 0; i < pairs.length; i++) {
        pair = pairs[i];
        separatorIndex = pair.indexOf("=");

        if (separatorIndex === -1) {
            escapedKey = pair;
            escapedValue = null;
        } else {
            escapedKey = pair.substr(0, separatorIndex);
            escapedValue = pair.substr(separatorIndex + 1);
        }

        key = decodeURIComponent(escapedKey);
        value = decodeURIComponent(escapedValue);

        data[key] = value;
    }

    return data;
}