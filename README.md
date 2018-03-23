# SimpleSocialShare.js

Simple social and email share script without using an iframe.

Plain JS ES6 with babelized ES5 version using [Babel JS](https://babeljs.io/) compiler.

### Social networks:
- Facebook
- Twitter
- Google Plus

### Email share includes:
- recipient
- CC
- BCC
- subject (optional page title & URL)
- body (optional page title & URL)

## How to use

```JS
new SimpleSocialShare();
```

### Facebook

```JS
const facebookShare = new SimpleSocialShare({
    facebook: '.js-share-facebook'
});
```

```HTML
<a href="#" class="js-share-facebook">Share this page on Facebook</a>
```

### Twitter

```JS
const twitterShare = new SimpleSocialShare({
    twitter: '.js-share-twitter'
});
```

```HTML
<a href="#" class="js-share-twitter">Tweet this page</a>
```

### Google Plus

```JS
const googlePlusShare = new SimpleSocialShare({
    googleplus: '.js-share-googleplus'
});
```

```HTML
<a href="#" class="js-share-googleplus">Share this page on G+</a>
```

### Email

Using JavaScript:

```JS
const emailShare = new SimpleSocialShare({
    email: {
        selector: '.js-share-email',
        recipient: 'test@test.com',
        subject: 'This is test email subject',
        cc: '',
        bcc: '',
        body: 'This is test email body text'
    }
});
```

```HTML
<a href="#" class="js-share-email">Create new email</a>
```

Using JavaScript and HTML data attributes:

```JS
const emailDataShare = new SimpleSocialShare({
    email: {
        selector: '.js-share-email'
    }
});
```

```HTML
<a href="#" class="js-share-email" data-recipient="test@test.com" data-subject="This is test email subject" data-cc="test2@test.com" data-bcc="test3@test.com" data-body="This is test email body text">Create new email</a>
```

Add page URL or page title to the email subject or body text:

```JS
// JS method
const emailShare = new SimpleSocialShare({
    email: {
        selector: '.js-share-email',
        subject: '{{PAGE.TITLE}}',
        body: 'Check out this link: {{PAGE.URL}}'
    }
});
```

```HTML
<!-- HTML DATA ATTRIBUTES --> 
<a href="#" class="js-share-email" data-subject="{{PAGE.TITLE}}" data-body="Check out this link: {{PAGE.URL}}">Create new email</a>
```

You can also combine page title and page URL:

```JS
const emailShare = new SimpleSocialShare({
    email: {
        selector: '.js-share-email',
        subject: '{{PAGE.URL}}',
        body: '{{PAGE.TITLE}} - Check out this link: {{PAGE.URL}}'
    }
});
```

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.