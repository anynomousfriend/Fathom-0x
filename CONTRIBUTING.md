# Contributing to Fathom Protocol

Thank you for your interest in contributing to Fathom! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/fathom.git
   cd fathom
   ```

2. **Install dependencies**
   ```bash
   # Oracle node
   cd oracle-node
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   
   # Scripts
   cd ../scripts
   npm install
   ```

3. **Set up environment files**
   - Copy `.env.example` files and fill in required values
   - Get testnet tokens from Sui faucet
   - Configure Walrus credentials

## Project Structure

```
fathom/
├── contracts/       # Sui Move smart contracts
├── oracle-node/     # Python oracle service
├── frontend/        # Next.js web application
├── scripts/         # Deployment and utility scripts
└── assets/          # Images, diagrams, documentation
```

## Coding Standards

### Move (Smart Contracts)
- Follow Sui Move style guide
- Document all public functions
- Include error codes with descriptive constants
- Write unit tests for all functions

### Python (Oracle)
- Follow PEP 8 style guide
- Use type hints
- Document functions with docstrings
- Handle errors gracefully

### TypeScript/React (Frontend)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

## Testing

### Smart Contracts
```bash
cd contracts
sui move test
```

### Oracle Node
```bash
cd oracle-node
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## Submitting Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise commit messages
   - Follow the coding standards
   - Add tests for new features

3. **Test thoroughly**
   - Run all tests
   - Test manually in development environment

4. **Submit a pull request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review

## Feature Ideas

Want to contribute but not sure where to start? Here are some ideas:

- [ ] Implement proper TEE integration with Nautilus
- [ ] Add support for multiple oracle nodes
- [ ] Implement vector embeddings for better RAG
- [ ] Add support for different document formats
- [ ] Improve error handling and recovery
- [ ] Add comprehensive test suite
- [ ] Optimize gas usage in contracts
- [ ] Create mobile-responsive UI improvements
- [ ] Add analytics dashboard
- [ ] Implement caching layer

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord (coming soon)
- Email: your.email@example.com

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing to Fathom! 🌊
