const LogLevelEnumeration = {
    Info: 0,
    UserAction: 1,
    Debug: 2,
    Warning: 3,
    Error: 4,
  };
  
  class Logger {
    constructor(key, prefix) {
      this.key = key;
      this.prefix = prefix || 'WEB';
      this.isActive = true;
      this.isDebugLogActive = false;
    }
  
    info(message, context) {
      if (!this.isActive) return;
      const log = {
        message,
        context: context || this.key,
        prefix: this.prefix,
        loggerKey: this.key,
        level: LogLevelEnumeration.Info,
        timeStamp: Date.now(),
      };
      this.archiveLog(log);
    }
  
    userAction(message, context) {
      if (!this.isActive) return;
      const log = {
        message,
        context: context || this.key,
        prefix: this.prefix,
        loggerKey: this.key,
        level: LogLevelEnumeration.UserAction,
        timeStamp: Date.now(),
      };
      this.archiveLog(log);
    }
  
    debug(message, context) {
      if (!this.isActive || !this.isDebugLogActive) return;
      const log = {
        message,
        context: context || this.key,
        prefix: this.prefix,
        loggerKey: this.key,
        level: LogLevelEnumeration.Debug,
        timeStamp: Date.now(),
      };
      this.archiveLog(log);
    }
  
    warning(message, context) {
      if (!this.isActive) return;
      const log = {
        message,
        context: context || this.key,
        prefix: this.prefix,
        loggerKey: this.key,
        level: LogLevelEnumeration.Warning,
        timeStamp: Date.now(),
      };
      this.archiveLog(log);
    }
  
    error(message, context) {
      if (!this.isActive) return;
      const log = {
        message,
        context: context || this.key,
        prefix: this.prefix,
        loggerKey: this.key,
        level: LogLevelEnumeration.Error,
        timeStamp: Date.now(),
      };
      this.archiveLog(log);
    }
  
    archiveLog(log) {
      LogProvider.archiveLog(log); // Use LogProvider to store logs
    }
  }
  
  module.exports = { Logger, LogLevelEnumeration };
  