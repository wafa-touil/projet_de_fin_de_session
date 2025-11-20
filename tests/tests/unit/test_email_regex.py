import re
import pytest

def is_valid_email(email: str) -> bool:
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def test_is_valid_email():
    valid_emails = [
        'test@example.com',
        'user.name@uqo.ca',
        'foo-bar@domain.co',
    ]
    invalid_emails = [
        'invalid',
        'user@',
        '@domain.com',
        'user@domain',
        'user@@domain.com'
    ]
    for email in valid_emails:
        assert is_valid_email(email)
    for email in invalid_emails:
        assert not is_valid_email(email)