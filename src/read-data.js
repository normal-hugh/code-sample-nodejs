const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: new AWS.Endpoint('http://192.168.0.25:3001'),
  region: 'us-west-2',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  // what could you do to improve performance?
});

const tableName = 'SchoolStudents';
const studentLastNameGsiName = 'studentLastNameGsi';

const toQuery = (params, table) => {
  return {
    TableName: table,
    KeyConditionExpression: Object.keys(params).map((key) => {
      if (key === 'studentId') {
        return '#student = :studentID'
      }
      if (key === 'schoolId') {
        return '#school = :schoolID'
      }
    }).join(' and '),
    ExpressionAttributeNames: {
      ...(params.studentId && {"#student": "studentId"}),
      ...(params.schoolId && {"#school": "schoolId"})
    },
    ExpressionAttributeValues: {
      ...(params.studentId && {":studentID": params.studentId}),
      ...(params.schoolId && {":schoolID": params.schoolId}),
    },
    // Limit: 5
  };
}

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.studentId
 * @param {string} [event.studentLastName]
 */
exports.handler = async (event, table = tableName) => {
  const results = await dynamodb.query(toQuery(event, table), (err, _) => {
    if (err) {
      throw new Error(err);
    }
  }).promise();
  return results.Items

  // TODO (extra credit) if event.studentLastName exists then query using the 'studentLastNameGsi' GSI and return the results.
};