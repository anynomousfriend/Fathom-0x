FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY oracle_node.py .
COPY .env.example .env

# Run oracle
CMD ["python", "oracle_node.py"]
