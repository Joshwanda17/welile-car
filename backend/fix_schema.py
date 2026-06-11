import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# Replace Decimal with Float
content = re.sub(r'Decimal\s+@db\.Decimal\(\d+,\s*\d+\)', 'Float', content)
content = re.sub(r'Decimal\s+@default\(0\.00\)\s+@db\.Decimal\(\d+,\s*\d+\)', 'Float @default(0)', content)
content = content.replace('Decimal', 'Float')

# List of enums to replace
enums = [
    'Role', 'UserStatus', 'KycStatus', 'EmploymentStatus', 'VehicleStatus',
    'AccountStatus', 'SavingsTxType', 'TransactionStatus', 'LoanAppStatus',
    'FinancingStatus', 'RepaymentStatus'
]

for enum_name in enums:
    content = re.sub(rf'{enum_name}\s+@default\((\w+)\)', r'String @default("\1")', content)
    content = re.sub(rf'{enum_name}\?', 'String?', content)
    content = re.sub(rf'{enum_name}', 'String', content)

# Remove the enum blocks at the bottom
content = re.sub(r'enum \w+ \{[^}]+\}', '', content)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
