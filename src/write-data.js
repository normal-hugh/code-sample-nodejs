const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-west-2',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  sslEnabled: false,
});

const tableName = 'SchoolStudents';

const validInput = (event) => {
  return (event.schoolId && event.studentId) ? true : false;
}

const toPut = (event, table) => {
  return {
    TableName: table,
    Item: event
  };
}

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.schoolName
 * @param {string} event.studentId
 * @param {string} event.studentFirstName
 * @param {string} event.studentLastName
 * @param {string} event.studentGrade
 */
exports.handler = async (event, table = tableName) => {
  if (!validInput(event)) {
    throw new Error('Record must contain schoolId & studentId');
  }
  await dynamodb.put(toPut(event, table), (err, data) => {
    if (err) {
      throw new Error(err);
    }
  }).promise();
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
};
