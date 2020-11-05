const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: new AWS.Endpoint('http://192.168.0.25:3001'),
  region: 'us-west-2',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  // what could you do to improve performance?
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
  // TODO validate that all expected attributes are present (assume they are all required)
  // TODO use the AWS.DynamoDB.DocumentClient to save the 'SchoolStudent' record
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
};
