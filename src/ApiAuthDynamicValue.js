const url = require('url');

@registerDynamicValueClass
class ApiAuthDynamicValue {
    static identifier = 'com.dteoh.PawExtensions.ApiAuthDynamicValue';
    static title = 'ApiAuth';
    static help = 'https://github.com/dteoh/Paw-ApiAuthDynamicValue';
    static inputs = [
        DynamicValueInput('access_id', 'Access ID', 'String'),
        DynamicValueInput('secret', 'Secret', 'SecureValue'),
        DynamicValueInput('content_md5', 'Content-MD5', 'String'),
    ];

    evaluate(context) {
        if (context.runtimeInfo.task != 'requestSend') {
            return;
        }
        const req = context.getCurrentRequest();
        const canonicalStr = this.generateCanonicalString(req);

        const hmac = new DynamicValue('com.luckymarmot.HMACDynamicValue', {
            input: canonicalStr,
            key: this.secret,
            algorithm: 1, // SHA1
            encoding: 'Hexadecimal',
        });
        return `APIAuth ${this.access_id}:${hmac.getEvaluatedString()}`;
    }

    generateCanonicalString(request) {
        const httpMethod = request.method;
        const contentType = request.getHeaderByName('Content-Type') || '';
        const contentMd5 = this.content_md5 || '';
        const requestUri = this.parseRequestUri(request.url);
        const timestamp = this.getCurrentTimestamp();

        return `${httpMethod},${contentType},${contentMd5},${requestUri},${timestamp}`
    }

    getCurrentTimestamp() {
        return new DynamicValue('com.luckymarmot.TimestampDynamicValue', {
            now: true,
            format: 2
        }).getEvaluatedString();
    }

    parseRequestUri(uri) {
        const result = url.parse(uri);
        return result.path;
    }
}