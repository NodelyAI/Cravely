## Troubleshooting Guide

### Common Issues

#### QR Code Generation Failures

**Symptoms:**

- Error message in function response
- Missing QR codes in Storage
- Incomplete table documents in Firestore

**Possible Solutions:**

1. Check Firebase Function logs in the console
2. Verify Firebase Storage permissions
3. Ensure the service account has proper permissions
4. Check network connectivity if using local emulators

#### Security Rule Rejections

**Symptoms:**

- "Permission denied" errors in console
- Operations failing without clear error messages
- Unexpected data access restrictions

**Possible Solutions:**

1. Review Firestore security rules in Firebase Console
2. Test rules with the Firebase Rules Simulator
3. Add debug logging with `console.log()` in rules
4. Verify authentication state for operations requiring auth

#### Guest Ordering Issues

**Symptoms:**

- Blank menu or missing items
- Failed order submissions
- Payment or customization errors

**Possible Solutions:**

1. Check browser console for JavaScript errors
2. Verify Firestore document structure
3. Ensure menu items are marked as "available"
4. Test deep links with correct IDs

#### AI Integration Problems

**Symptoms:**

- Empty or generic responses
- Context not being applied to recommendations
- AI service errors

**Possible Solutions:**

1. Verify API key is set correctly
2. Check request format in Network tab
3. Ensure context data is properly formatted
4. Review rate limits or quota restrictions

## Security Considerations

- QR codes use secure deep links that cannot be guessed
- Guest orders are limited to creation only, not viewing others' data
- Staff operations require proper authentication and restaurant ID matching
- API keys and secrets are protected through environment variables

## Future Enhancements

- **Payment Integration:** Add direct payment processing through Stripe API
- **Kitchen Display System:** Create dedicated view for kitchen staff
- **Order Timing:** Implement estimated preparation and delivery times
- **Customer Accounts:** Optional login for order history and preferences
- **Advanced Analytics:** Restaurant performance metrics and inventory suggestions

---

For additional support, contact the development team at support@cravely.app
