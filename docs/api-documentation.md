# Enterprise SaaS Platform API Documentation

## Overview

This document provides comprehensive documentation for the Enterprise SaaS Platform API. The API follows RESTful principles with OAuth 2.0/OIDC authentication, rate limiting, and comprehensive security features.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL and Versioning](#base-url-and-versioning)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
6. [Security](#security)
7. [Webhooks](#webhooks)
8. [SDK and Examples](#sdk-and-examples)

## Authentication

### OAuth 2.0/OIDC Flow

The API uses OAuth 2.0 with OpenID Connect for authentication. Clients can obtain access tokens using one of the following methods:

#### Authorization Code Flow (Recommended)

```http
GET /auth/authorize?
  response_type=code&
  client_id={client_id}&
  redirect_uri={redirect_uri}&
  scope={scope}&
  state={state}
```

#### Client Credentials Flow (Service-to-Service)

```http
POST /auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id={client_id}&
client_secret={client_secret}&
scope={scope}
```

#### Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "tasks.read tasks.write"
}
```

### Token Usage

Include the access token in the Authorization header:

```http
Authorization: Bearer {access_token}
```

### Multi-Tenant Context

The API automatically determines tenant context from the authenticated user's profile. All requests are scoped to the user's tenant.

## Base URL and Versioning

### Base URL

```
https://api.enterprise-saas.com
```

### Versioning

API versions are specified in the URL path:

```
/api/v1/...
/api/v2/...
```

### Version Lifecycle

- **Current**: v2
- **Deprecated**: v1 (sunset date: 2025-12-31)
- **Supported**: v2, v1

### Version Negotiation

You can also specify version via header:

```http
API-Version: v2
```

## Rate Limiting

### Default Limits

| Tier       | Requests/Minute | Requests/Hour | Requests/Day |
| ---------- | --------------- | ------------- | ------------ |
| Free       | 60              | 1,000         | 10,000       |
| Pro        | 300             | 10,000        | 100,000      |
| Enterprise | 1,000           | 50,000        | 1,000,000    |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

### Rate Limit Exceeded Response

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again in 60 seconds.",
    "retry_after": 60
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    },
    "request_id": "req_123456789",
    "timestamp": "2023-12-23T03:58:03Z"
  }
}
```

### HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Unprocessable Entity  |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |
| 503  | Service Unavailable   |

### Error Codes

| Code                  | Description                       |
| --------------------- | --------------------------------- |
| `INVALID_REQUEST`     | Request is malformed              |
| `UNAUTHORIZED`        | Authentication required or failed |
| `FORBIDDEN`           | Insufficient permissions          |
| `NOT_FOUND`           | Resource not found                |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded               |
| `VALIDATION_ERROR`    | Request validation failed         |
| `TENANT_SUSPENDED`    | Tenant account is suspended       |
| `QUOTA_EXCEEDED`      | Usage quota exceeded              |

## API Endpoints

### Tasks

#### Create Task

```http
POST /api/v2/tasks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Complete project proposal",
  "description": "Write and review the Q1 project proposal",
  "duration_minutes": 120,
  "color": "blue",
  "session_id": "session_123",
  "scheduled_time": "2023-12-23T10:00:00Z"
}
```

**Response**

```http
HTTP/1.1 201 Created

{
  "data": {
    "id": "task_123",
    "title": "Complete project proposal",
    "description": "Write and review the Q1 project proposal",
    "duration_minutes": 120,
    "color": "blue",
    "session_id": "session_123",
    "scheduled_time": "2023-12-23T10:00:00Z",
    "completed": false,
    "position": 1,
    "created_at": "2023-12-23T03:58:03Z",
    "updated_at": "2023-12-23T03:58:03Z"
  }
}
```

#### List Tasks

```http
GET /api/v2/tasks?session_id=session_123&completed=false&limit=50
Authorization: Bearer {access_token}
```

**Query Parameters**

- `session_id` (optional): Filter by session
- `completed` (optional): Filter by completion status
- `limit` (optional, default: 50, max: 100): Number of tasks to return
- `offset` (optional, default: 0): Number of tasks to skip

**Response**

```http
HTTP/1.1 200 OK

{
  "data": [
    {
      "id": "task_123",
      "title": "Complete project proposal",
      "completed": false,
      "created_at": "2023-12-23T03:58:03Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1,
    "has_more": false
  }
}
```

#### Update Task

```http
PATCH /api/v2/tasks/{task_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Updated task title",
  "completed": true,
  "position": 2
}
```

#### Delete Task

```http
DELETE /api/v2/tasks/{task_id}
Authorization: Bearer {access_token}
```

### AI Task Compression

#### Compress Text to Tasks

```http
POST /api/v2/compress
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "text": "I need to finish the quarterly report, review the budget, and schedule a meeting with the team about the new project timeline. Also should call the client about the contract renewal.",
  "session_id": "session_123"
}
```

**Response**

```http
HTTP/1.1 200 OK

{
  "data": {
    "tasks": [
      {
        "title": "Finish quarterly report",
        "duration_minutes": 120,
        "color": "blue",
        "reasoning": "High priority financial document that needs completion"
      },
      {
        "title": "Review budget",
        "duration_minutes": 60,
        "color": "orange",
        "reasoning": "Important for understanding financial planning"
      },
      {
        "title": "Schedule team meeting",
        "duration_minutes": 15,
        "color": "green",
        "reasoning": "Quick coordination task for project timeline"
      },
      {
        "title": "Call client about contract",
        "duration_minutes": 30,
        "color": "purple",
        "reasoning": "Revenue-critical conversation requiring follow-up"
      }
    ]
  }
}
```

### Projects

#### Create Project

```http
POST /api/v2/projects
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Q1 Planning",
  "description": "Quarterly planning and goal setting"
}
```

#### List Projects

```http
GET /api/v2/projects?status=active&limit=20
Authorization: Bearer {access_token}
```

### Users

#### Get Current User

```http
GET /api/v2/users/me
Authorization: Bearer {access_token}
```

**Response**

```http
HTTP/1.1 200 OK

{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "admin",
    "tenant_id": "tenant_123",
    "preferences": {
      "theme": "light",
      "notifications": true
    },
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

#### Update User Profile

```http
PATCH /api/v2/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "John Smith",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

### Analytics

#### Get Task Analytics

```http
GET /api/v2/analytics/tasks?period=last_30_days
Authorization: Bearer {access_token}
```

**Response**

```http
HTTP/1.1 200 OK

{
  "data": {
    "period": "last_30_days",
    "total_tasks": 156,
    "completed_tasks": 142,
    "completion_rate": 91.0,
    "average_duration": 45,
    "tasks_by_color": {
      "blue": 45,
      "green": 38,
      "orange": 32,
      "purple": 25,
      "coral": 16
    },
    "productivity_score": 8.5
  }
}
```

### System Health

#### Health Check

```http
GET /api/v2/health
```

**Response**

```http
HTTP/1.1 200 OK

{
  "status": "healthy",
  "timestamp": "2023-12-23T03:58:03Z",
  "version": "2.1.0",
  "services": {
    "database": "healthy",
    "cache": "healthy",
    "ai_service": "healthy"
  }
}
```

## Security

### Input Validation

All API endpoints implement comprehensive input validation:

- **String length limits**: Minimum 1, maximum 5000 characters
- **Input sanitization**: HTML/script injection prevention
- **Type validation**: Strict JSON schema validation
- **SQL injection prevention**: Parameterized queries only

### Data Encryption

- **At rest**: AES-256 encryption for sensitive data
- **In transit**: TLS 1.3 for all communications
- **Field-level encryption**: PII and PHI data encrypted
- **Key rotation**: Automated encryption key rotation

### Audit Logging

All API requests are logged for security and compliance:

```json
{
  "timestamp": "2023-12-23T03:58:03Z",
  "request_id": "req_123456789",
  "user_id": "user_123",
  "tenant_id": "tenant_123",
  "method": "POST",
  "path": "/api/v2/tasks",
  "status_code": 201,
  "response_time_ms": 45,
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0..."
}
```

### CORS Policy

```http
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type, X-Request-ID
Access-Control-Allow-Credentials: true
```

## Webhooks

### Webhook Configuration

```http
POST /api/v2/webhooks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "url": "https://yourapp.com/webhooks/tasks",
  "events": ["task.created", "task.updated", "task.completed"],
  "secret": "webhook_secret_key"
}
```

### Event Types

- `task.created`: New task created
- `task.updated`: Task updated
- `task.completed`: Task marked as completed
- `project.created`: New project created
- `user.created`: New user registered
- `tenant.created`: New tenant created

### Webhook Payload Example

```json
{
  "id": "evt_123456789",
  "type": "task.created",
  "created": "2023-12-23T03:58:03Z",
  "data": {
    "task": {
      "id": "task_123",
      "title": "New task",
      "created_at": "2023-12-23T03:58:03Z"
    },
    "user": {
      "id": "user_123",
      "email": "user@example.com"
    }
  }
}
```

### Webhook Security

Webhooks are signed with HMAC-SHA256:

```http
X-Webhook-Signature: sha256=a1b2c3d4e5f6...
```

## SDK and Examples

### JavaScript/TypeScript SDK

```typescript
import { EnterpriseSaaS } from "@enterprise-saas/sdk";

const client = new EnterpriseSaaS({
  apiKey: "your_api_key",
  baseURL: "https://api.enterprise-saas.com",
});

// Create a task
const task = await client.tasks.create({
  title: "Complete project proposal",
  duration_minutes: 120,
  color: "blue",
});

// List tasks
const tasks = await client.tasks.list({
  session_id: "session_123",
  limit: 50,
});

// Compress text to tasks
const compressed = await client.ai.compress({
  text: "I need to finish the report and schedule a meeting",
  session_id: "session_123",
});
```

### Python SDK

```python
from enterprise_saas import Client

client = Client(api_key='your_api_key')

# Create a task
task = client.tasks.create({
    'title': 'Complete project proposal',
    'duration_minutes': 120,
    'color': 'blue'
})

# List tasks
tasks = client.tasks.list(session_id='session_123', limit=50)
```

### cURL Examples

#### Create Task

```bash
curl -X POST https://api.enterprise-saas.com/api/v2/tasks \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project proposal",
    "duration_minutes": 120,
    "color": "blue",
    "session_id": "session_123"
  }'
```

#### List Tasks

```bash
curl -X GET "https://api.enterprise-saas.com/api/v2/tasks?session_id=session_123&limit=50" \
  -H "Authorization: Bearer {access_token}"
```

#### AI Task Compression

```bash
curl -X POST https://api.enterprise-saas.com/api/v2/compress \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I need to finish the quarterly report and schedule a team meeting",
    "session_id": "session_123"
  }'
```

### Error Handling Examples

```typescript
try {
  const task = await client.tasks.create({
    title: "New task",
    duration_minutes: 30,
  });
} catch (error) {
  if (error.code === "RATE_LIMIT_EXCEEDED") {
    // Wait and retry
    await new Promise((resolve) =>
      setTimeout(resolve, error.retry_after * 1000)
    );
    return client.tasks.create(taskData);
  } else if (error.code === "VALIDATION_ERROR") {
    // Fix input and retry
    console.error("Validation error:", error.details);
  } else {
    // Handle other errors
    console.error("Unexpected error:", error);
  }
}
```

This API documentation provides comprehensive coverage of all available endpoints, security features, and integration patterns for the Enterprise SaaS Platform.
