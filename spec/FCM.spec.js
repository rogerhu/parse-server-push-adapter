var FCM = require('../src/FCM').default;

function mockSender(fcm) {
  return spyOn(fcm.sender, 'send').and.returnValue(Promise.resolve(
    "projects/maps-demo-12345/messages/0:2525593087651740%115f88a9f9fd7ecd"));
  }

let fakePrivateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYW+KKKvDTuHR7\nOPmdUTbXe+IJWqres0qI9i8zvL+UZHYKkCV9tsNmhP0q3E5kKWLTj54SGw6QlHyO\n8cZCzRa9FtSrMLiOTBzFYWUeqq8x7mFb4TH+Y2kbj3GM22lfP3V+DamJv7S/Ho0w\n0y/hlKyJspGXph8gVV87tU6va53aaV2pottCOsbQvaRIdWz3YQ9UFTlh08djVidJ\nr2q7M6PfV0ZpPcF3+riRy2jnNWFAsB4pgWK72TXbZsh3X0+oQtmxZQ9gHK3F09On\nQ6JaV43kGLY9qwYEcAiXqW+lN3seJsfU3t/TAW7dLoIt8dtyNK9VhnAshs/vqhO8\nUfb2kB57AgMBAAECggEABnr2BkFwT9kLH0ibmVzgc8bhpNs15FYE6BFsjYtMLMAf\nIzDhX1j8M6qZaA7JyMnX2b7EjumWs4CVUbEn6SR3AKDtd8CRQQAswxpy5hyFah7F\nBlbsPPE2gcUWo9KbR0FYOn3TRbghNHXUtIxu/23G7u5o8eXPch0feVcrWxu9MZJz\n6qU+hq+/Yl6BAlBrLNqJ31IBNGqj5ogG8aeR+gt2PjP6WExlpY9z+3dj77zMdLkm\ndU8jkm+z2VmR02I7EuOHgDKB2E6EW/0snI9VMVa116nTD2wYDpBOZL4V11ESI+La\nUI8T394x/briPoMg0yiV28RjOZkr6DnaIyssDOEkNQKBgQDKihDPtFrPTYbi9Ib1\nRnbp+3HD+EhjcN2l8gUuapMq2Rzpbu4DIv/iC740sNiZt0ba2M+OBIzhf6HlrjCm\nfrpa++WL9R9qIXSeOgxm+oc+Jho1jeEoe0K9V9FMn2t61ku2aO4r0TbSBv1sto9I\nzjI/gWPVO/s/krFQ3fer2D1B7wKBgQDAkwrvUfiStYF6H66YRM0O55i2Eui3F1m9\n2O0sghZpt9LPkSJVmA8J3ml29512QfN2nFxXEu2GoqFIRZKKBJrH7e6iVrSmjTm6\ntXOvNn7JwuRmZe+oqxPzTzqsAkTpGGv4ip/Mq6+3hcxuYClfUo6UtyMz8aggDdQ4\n1VL4304INQKBgAbZ/tGX70599+crkHkxpgoqSGHxvzkl80mO02ALmOjlKVY4O3L9\ntxxFe2y64sjoa0wx82uBeeaS874aU2j+dn1ncg92/lYPxasomYzOQs72aQKQxyIg\ncVSIaPsnlXI1V6BXEl+HF0ypkd8gmd5Do22EigUHn2s6IidzKtK0YPYfAoGANJdz\nwwwV4KslIx8H5ZnUjp99OyxK1cXQwmI904vrZw/GyN0QDWQrpzxQfSb+n88/GEN3\njGgk6kH73eryLDM5uiQmqbsYNuwWugDYCR/O3HcXPUfVfbDLEAWxNkygWTBMPGJP\nZev1Xx9xRyuH4PqA6ehh+suiaK6eKK9Jq6IAg4kCgYAv+Le8grnT9g9Ev/ezL8em\niFWQ5G6XSHO1i9jTXXaW7jkkvSYaE5igeFWieW78O9bo27xPdOaJ3aR+DzKkCF7F\n7pKsbp2H5AuV2E06J7M3rdzFoRrINe3yBPKYdyoc4P9sjkBeAu5wJDm/ywjmM0R3\nS+lVpZCdvKMS3U4SB0luHw==\n-----END PRIVATE KEY-----\n";

describe('FCM', () => {
  it('can initialize', (done) => {
    var args = {
      projectId: '123',
      privateKey: fakePrivateKey,
      clientEmail: 'sdds@iam.com',
      databaseURL: 'https://XXXX-1234.firebaseio.com'
    };
    var fcm = new FCM(args);
    done();
  });

  it('can throw on initializing with invalid args', (done) => {
    var args = 123
    expect(function() {
      new FCM(args);
    }).toThrow();
    args = {
      projectId: '123',
      privateKey: 'abcd',
      clientEmail: 'sdds@iam.com'
    };
    expect(function() {
      new FCM(args);
    }).toThrow();
    args = undefined;
    expect(function() {
      new FCM(args);
    }).toThrow();
    done();
  });

  it('can generate FCM Payload without expiration time', (done) => {
    //Mock request data
    var requestData = {
      data: {
        'alert': 'alert'
      },
      notification: {
        'title': 'I am a title',
        'body': 'I am a body'
      }
    };
    var pushId = 'pushId';
    var timeStamp = 1454538822113;
    var timeStampISOStr = new Date(timeStamp).toISOString();

    var payload = FCM.generateFCMPayload(requestData, pushId, timeStamp);
    var androidPayload = JSON.parse(payload.android);
    expect(androidPayload.priority).toEqual('high');
    expect(androidPayload.ttl).toEqual(undefined);

    // Firebase NodeJS lib requires only strings for data, so JSON parse it here.
    var dataFromPayload = JSON.parse(payload.data);
    expect(dataFromPayload.time).toEqual(timeStampISOStr);
    expect(payload.notification).toEqual(requestData.notification);
    expect(dataFromPayload['push_id']).toEqual(pushId);
    var dataFromUser = dataFromPayload.data;
    expect(dataFromUser).toEqual(requestData.data);
    done();
  });

  it('can generate FCM Payload with valid expiration time', (done) => {
    //Mock request data
    var requestData = {
      data: {
        'alert': 'alert'
      },
      notification: {
        'title': 'I am a title',
        'body': 'I am a body'
      }
    };
    var pushId = 'pushId';
    var timeStamp = 1454538822113;
    var timeStampISOStr = new Date(timeStamp).toISOString();
    var expirationTime = 1454538922113

    var payload = FCM.generateFCMPayload(requestData, pushId, timeStamp, expirationTime);

    var androidPayload = JSON.parse(payload.android);
    expect(androidPayload.priority).toEqual('high');
    expect(androidPayload.ttl).toEqual(Math.floor((expirationTime - timeStamp) / 1000) + "s");
    var dataFromPayload = JSON.parse(payload.data);
    expect(dataFromPayload.time).toEqual(timeStampISOStr);
    expect(payload.notification).toEqual(requestData.notification);
    expect(dataFromPayload['push_id']).toEqual(pushId);
    var dataFromUser = dataFromPayload.data;
    expect(dataFromUser).toEqual(requestData.data);
    done();
  });

  it('can generate FCM Payload with too early expiration time', (done) => {
    //Mock request data
    var requestData = {
      data: {
        'alert': 'alert'
      },
      notification: {
        'title': 'I am a title',
        'body': 'I am a body'
      }
    };
    var pushId = 'pushId';
    var timeStamp = 1454538822113;
    var timeStampISOStr = new Date(timeStamp).toISOString();
    var expirationTime = 1454538822112;

    var payload = FCM.generateFCMPayload(requestData, pushId, timeStamp, expirationTime);

    var androidPayload = JSON.parse(payload.android);
    expect(androidPayload.priority).toEqual('high');
    expect(androidPayload.ttl).toEqual("0s");

    var dataFromPayload = JSON.parse(payload.data);
    expect(dataFromPayload.time).toEqual(timeStampISOStr);
    expect(payload.notification).toEqual(requestData.notification);

    expect(dataFromPayload['push_id']).toEqual(pushId);
    var dataFromUser = dataFromPayload.data;
    expect(dataFromUser).toEqual(requestData.data);
    done();
  });

  it('can generate FCM Payload with too late expiration time', (done) => {
    //Mock request data
    var requestData = {
      data: {
        'alert': 'alert'
      },
      notification: {
        'title': 'I am a title',
        'body': 'I am a body'
      }
    };
    var pushId = 'pushId';
    var timeStamp = 1454538822113;
    var timeStampISOStr = new Date(timeStamp).toISOString();
    var expirationTime = 2454538822113;

    var payload = FCM.generateFCMPayload(requestData, pushId, timeStamp, expirationTime);

    var androidPayload = JSON.parse(payload.android);
    expect(androidPayload.priority).toEqual('high');
    // Four week in second
    expect(androidPayload.ttl).toEqual(4 * 7 * 24 * 60 * 60 + "s");

    var dataFromPayload = JSON.parse(payload.data);
    expect(dataFromPayload.time).toEqual(timeStampISOStr);
    expect(payload.notification).toEqual(requestData.notification);
    expect(dataFromPayload['push_id']).toEqual(pushId);
    var dataFromUser = dataFromPayload.data;
    expect(dataFromUser).toEqual(requestData.data);
    done();
  });

  it('can send FCM request #1', (done) => {
    var fcm = new FCM({
      projectId: 'can-send-fcm',
      privateKey: fakePrivateKey,
      clientEmail: 'sdds@iam.com',
      databaseURL: 'https://XXXX-12345.firebaseio.com',
      appName: 'fcm-request'
    });
    // Mock FCM sender
    var sender = {
          send: jasmine.createSpy('send')
        };
    fcm.sender = sender;
    // Mock data
    var expirationTime = 2454538822113;
    var data = {
      'expiration_time': expirationTime,
      'data': {'alert': 'alert'}
    }
    // Mock devices
    var devices = [
      {
        deviceToken: 'token'
      }
    ];
    fcm.send(data, devices);
    expect(sender.send).toHaveBeenCalled();
    var args = sender.send.calls.first().args;
    // It is too hard to verify message of FCM library, we just verify tokens and retry times
    expect(args[1].registrationTokens).toEqual(['token']);
    expect(args[2]).toEqual(5);
    done();
  });

  it('can send FCM request #2', (done) => {
    var fcm = new FCM({
      projectId: 'can-send-fcm',
      privateKey: fakePrivateKey,
      clientEmail: 'sdds@iam.com',
      databaseURL: 'https://XXXX-12345.firebaseio.com',
      appName: "fcm-request-2"
    });

    // Mock data
    var expirationTime = 2454538822113;
    var data = {
      'expiration_time': expirationTime,
      'data': JSON.stringify({'alert': 'alert'})
    }
    // Mock devices
    var devices = [
      {
        deviceToken: 'token'
      },
      {
        deviceToken: 'token2'
      },
      {
        deviceToken: 'token3'
      },
      {
        deviceToken: 'token4'
      }
    ];
    mockSender(fcm);
    fcm.send(data, devices).then((response) => {
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toEqual(devices.length);
      expect(response.length).toEqual(4);
      response.forEach((res, index) => {
        expect(res.transmitted).toEqual(true);
        expect(res.device).toEqual(devices[index]);
      })
      done();
    })
  });

  it('can send FCM request with slices', (done) => {
    let originalMax = FCM.FCMRegistrationTokensMax;
    FCM.FCMRegistrationTokensMax = 2;
    var fcm = new FCM({
      projectId: 'can-send-fcm',
      privateKey: fakePrivateKey,
      clientEmail: 'sdds@iam.com',
      databaseURL: 'https://XXXX-12345.firebaseio.com',
      appName: 'fcm-request-slices'
    });
    // Mock data
    var expirationTime = 2454538822113;
    var data = {
      'expiration_time': expirationTime,
      'data': JSON.stringify({'alert': 'alert'})
    }
    // Mock devices
    var devices = [
      {
        deviceToken: 'token'
      },
      {
        deviceToken: 'token2'
      },
      {
        deviceToken: 'token3'
      },
      {
        deviceToken: 'token4'
      },
      {
        deviceToken: 'token5'
      },
      {
        deviceToken: 'token6'
      },
      {
        deviceToken: 'token7'
      },
      {
        deviceToken: 'token8'
      }
    ];
    spyOn(fcm.sender, 'send').and.callThrough();
    fcm.send(data, devices).then((response) => {
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toEqual(devices.length);
      expect(response.length).toEqual(8);
      response.forEach((res, index) => {
        expect(res.transmitted).toEqual(false);
        expect(res.device).toEqual(devices[index]);
      });
      // 1 original call
      // 4 calls (1 per slice of 2)
      expect(FCM.send.calls.count()).toBe(1+4);
      FCM.FCMRegistrationTokensMax = originalMax;
      done();
    })
  });

  it('can slice devices', (done) => {
    // Mock devices
    var devices = [makeDevice(1), makeDevice(2), makeDevice(3), makeDevice(4)];

    var chunkDevices = FCM.sliceDevices(devices, 3);
    expect(chunkDevices).toEqual([
      [makeDevice(1), makeDevice(2), makeDevice(3)],
      [makeDevice(4)]
    ]);
    done();
  });

  function makeDevice(deviceToken) {
    return {
      deviceToken: deviceToken
    };
  }
});
