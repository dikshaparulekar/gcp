// require the Pub/Sub client library 
const { PubSub } = require('@google-cloud/pubsub');

// Initialize a Pub/Sub client instance
const pubsub = new PubSub();

// function
exports.processfile = async (req, res) => {
  try {
    // getting the file data from request body
    const file = req.body;

    // name of the file
    const fileName = file.name || 'unknown';

    // size of the file
    const size = file.size || '0';

    //contenttype of file
    const contentType = file.contentType || 'unknown';

    // getting the format of the file from contenttype
    const format = contentType.split('/')[1] || 'unknown';

    // create message object 
    const messageData = {
      file_name: fileName,
      size: size,
      format: format,
    };

    // convert the message object to buffer to publish
    const dataBuffer = Buffer.from(JSON.stringify(messageData));

    // publish the message on the topic 
    await pubsub.topic('assign-3-topic-sunil').publishMessage({ data: dataBuffer });

    //published message
    console.log(`Published message: ${JSON.stringify(messageData)}`);

    // respond to the HTTP request with a success message
    res.status(200).send('Message published');
  } catch (err) {
    // error message
    console.error('Error:', err);
    res.status(500).send('Error publishing message');
  }
};
