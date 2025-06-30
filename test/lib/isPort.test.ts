import { describe, expect, test } from 'bun:test'
import isPort from '../../src/lib/isPort'

describe('isPort', () => {
  describe('basic port validation', () => {
    test('should validate valid port numbers', () => {
      expect(isPort('80')).toBe(true) // HTTP
      expect(isPort('443')).toBe(true) // HTTPS
      expect(isPort('22')).toBe(true) // SSH
      expect(isPort('21')).toBe(true) // FTP
      expect(isPort('25')).toBe(true) // SMTP
      expect(isPort('53')).toBe(true) // DNS
      expect(isPort('110')).toBe(true) // POP3
      expect(isPort('143')).toBe(true) // IMAP
    })

    test('should validate port range boundaries', () => {
      expect(isPort('0')).toBe(true) // minimum port
      expect(isPort('1')).toBe(true) // first usable port
      expect(isPort('65535')).toBe(true) // maximum port
      expect(isPort('65534')).toBe(true) // near maximum
    })

    test('should reject invalid port numbers', () => {
      expect(isPort('65536')).toBe(false) // above maximum
      expect(isPort('99999')).toBe(false) // way above maximum
      expect(isPort('-1')).toBe(false) // negative
      expect(isPort('-80')).toBe(false) // negative
    })

    test('should reject non-numeric strings', () => {
      expect(isPort('abc')).toBe(false)
      expect(isPort('80a')).toBe(false)
      expect(isPort('a80')).toBe(false)
      expect(isPort('8a0')).toBe(false)
      expect(isPort('port')).toBe(false)
      expect(isPort('HTTP')).toBe(false)
    })

    test('should handle empty and whitespace strings', () => {
      expect(isPort('')).toBe(false)
      expect(isPort(' ')).toBe(false)
      expect(isPort('   ')).toBe(false)
      expect(isPort('\t')).toBe(false)
      expect(isPort('\n')).toBe(false)
    })
  })

  describe('well-known ports', () => {
    test('should validate system ports (0-1023)', () => {
      expect(isPort('20')).toBe(true) // FTP data
      expect(isPort('21')).toBe(true) // FTP control
      expect(isPort('22')).toBe(true) // SSH
      expect(isPort('23')).toBe(true) // Telnet
      expect(isPort('25')).toBe(true) // SMTP
      expect(isPort('53')).toBe(true) // DNS
      expect(isPort('67')).toBe(true) // DHCP server
      expect(isPort('68')).toBe(true) // DHCP client
      expect(isPort('69')).toBe(true) // TFTP
      expect(isPort('80')).toBe(true) // HTTP
      expect(isPort('110')).toBe(true) // POP3
      expect(isPort('123')).toBe(true) // NTP
      expect(isPort('143')).toBe(true) // IMAP
      expect(isPort('161')).toBe(true) // SNMP
      expect(isPort('443')).toBe(true) // HTTPS
      expect(isPort('993')).toBe(true) // IMAPS
      expect(isPort('995')).toBe(true) // POP3S
    })

    test('should validate registered ports (1024-49151)', () => {
      expect(isPort('1024')).toBe(true) // first registered port
      expect(isPort('1433')).toBe(true) // SQL Server
      expect(isPort('1521')).toBe(true) // Oracle
      expect(isPort('3000')).toBe(true) // Node.js development
      expect(isPort('3306')).toBe(true) // MySQL
      expect(isPort('5432')).toBe(true) // PostgreSQL
      expect(isPort('5672')).toBe(true) // AMQP
      expect(isPort('6379')).toBe(true) // Redis
      expect(isPort('8080')).toBe(true) // HTTP alternate
      expect(isPort('8443')).toBe(true) // HTTPS alternate
      expect(isPort('27017')).toBe(true) // MongoDB
      expect(isPort('49151')).toBe(true) // last registered port
    })

    test('should validate dynamic/private ports (49152-65535)', () => {
      expect(isPort('49152')).toBe(true) // first dynamic port
      expect(isPort('50000')).toBe(true)
      expect(isPort('55000')).toBe(true)
      expect(isPort('60000')).toBe(true)
      expect(isPort('65534')).toBe(true)
      expect(isPort('65535')).toBe(true) // last valid port
    })
  })

  describe('edge cases', () => {
    test('should handle leading zeros', () => {
      expect(isPort('080')).toBe(false) // leading zero not allowed
      expect(isPort('0080')).toBe(false) // multiple leading zeros not allowed
      expect(isPort('00080')).toBe(false) // many leading zeros not allowed
      expect(isPort('0')).toBe(true) // just zero is allowed
      expect(isPort('00')).toBe(false) // multiple zeros not allowed
    })

    test('should reject strings with whitespace', () => {
      expect(isPort(' 80')).toBe(false) // leading space
      expect(isPort('80 ')).toBe(false) // trailing space
      expect(isPort(' 80 ')).toBe(false) // surrounding spaces
      expect(isPort('8 0')).toBe(false) // space in middle
      expect(isPort('\t80')).toBe(false) // tab
      expect(isPort('80\n')).toBe(false) // newline
    })

    test('should reject strings with special characters', () => {
      expect(isPort('80.')).toBe(false)
      expect(isPort('80,')).toBe(false)
      expect(isPort('80-')).toBe(false)
      expect(isPort('80+')).toBe(false)
      expect(isPort('80#')).toBe(false)
      expect(isPort('80@')).toBe(false)
      expect(isPort('80!')).toBe(false)
      expect(isPort('80%')).toBe(false)
    })

    test('should reject decimal numbers', () => {
      expect(isPort('80.0')).toBe(false)
      expect(isPort('80.5')).toBe(false)
      expect(isPort('443.0')).toBe(false)
      expect(isPort('3000.1')).toBe(false)
    })

    test('should reject scientific notation', () => {
      expect(isPort('8e1')).toBe(false) // 80 in scientific notation
      expect(isPort('4.43e2')).toBe(false) // 443 in scientific notation
      expect(isPort('1E3')).toBe(false) // 1000 in scientific notation
    })
  })

  describe('boundary validation', () => {
    test('should validate port 0 (reserved)', () => {
      expect(isPort('0')).toBe(true)
    })

    test('should validate maximum port 65535', () => {
      expect(isPort('65535')).toBe(true)
    })

    test('should reject port 65536 (out of range)', () => {
      expect(isPort('65536')).toBe(false)
    })

    test('should reject negative ports', () => {
      expect(isPort('-1')).toBe(false)
      expect(isPort('-80')).toBe(false)
      expect(isPort('-443')).toBe(false)
      expect(isPort('-65535')).toBe(false)
    })

    test('should handle very large numbers', () => {
      expect(isPort('100000')).toBe(false)
      expect(isPort('999999')).toBe(false)
      expect(isPort('1000000')).toBe(false)
      expect(isPort('9999999999')).toBe(false)
    })
  })

  describe('real-world use cases', () => {
    test('should validate web server ports', () => {
      expect(isPort('80')).toBe(true) // HTTP
      expect(isPort('443')).toBe(true) // HTTPS
      expect(isPort('8080')).toBe(true) // HTTP alternate
      expect(isPort('8443')).toBe(true) // HTTPS alternate
      expect(isPort('3000')).toBe(true) // Development server
      expect(isPort('4000')).toBe(true) // Development server
      expect(isPort('5000')).toBe(true) // Development server
      expect(isPort('8000')).toBe(true) // HTTP alternate
    })

    test('should validate database ports', () => {
      expect(isPort('3306')).toBe(true) // MySQL
      expect(isPort('5432')).toBe(true) // PostgreSQL
      expect(isPort('1433')).toBe(true) // SQL Server
      expect(isPort('1521')).toBe(true) // Oracle
      expect(isPort('27017')).toBe(true) // MongoDB
      expect(isPort('6379')).toBe(true) // Redis
      expect(isPort('11211')).toBe(true) // Memcached
      expect(isPort('9042')).toBe(true) // Cassandra
    })

    test('should validate mail server ports', () => {
      expect(isPort('25')).toBe(true) // SMTP
      expect(isPort('110')).toBe(true) // POP3
      expect(isPort('143')).toBe(true) // IMAP
      expect(isPort('465')).toBe(true) // SMTPS
      expect(isPort('587')).toBe(true) // SMTP submission
      expect(isPort('993')).toBe(true) // IMAPS
      expect(isPort('995')).toBe(true) // POP3S
    })

    test('should validate development and testing ports', () => {
      expect(isPort('3000')).toBe(true) // React dev server
      expect(isPort('3001')).toBe(true) // Next.js dev server
      expect(isPort('4200')).toBe(true) // Angular dev server
      expect(isPort('5173')).toBe(true) // Vite dev server
      expect(isPort('8080')).toBe(true) // Webpack dev server
      expect(isPort('9000')).toBe(true) // Testing server
      expect(isPort('9001')).toBe(true) // Testing server
    })

    test('should validate game server ports', () => {
      expect(isPort('25565')).toBe(true) // Minecraft
      expect(isPort('27015')).toBe(true) // Source engine games
      expect(isPort('7777')).toBe(true) // Unreal Tournament
      expect(isPort('28960')).toBe(true) // Call of Duty
      expect(isPort('25000')).toBe(true) // Xonotic
    })
  })

  describe('performance considerations', () => {
    test('should handle many port validations efficiently', () => {
      const ports = [
        '80',
        '443',
        '22',
        '21',
        '25',
        '53',
        '110',
        '143',
        '3000',
        '3306',
        '5432',
        '6379',
        '8080',
        '8443',
        '65535',
        '0',
        '1',
        '1024',
        '49151',
        '49152',
      ]

      const start = Date.now()
      ports.forEach((port) => {
        isPort(port)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should validate ports quickly', () => {
      const start = Date.now()
      for (let i = 0; i < 1000; i++) {
        isPort('80')
        isPort('443')
        isPort('65536') // invalid
        isPort('abc') // invalid
      }
      const end = Date.now()

      expect(end - start).toBeLessThan(200) // Should handle many validations quickly
    })
  })

  describe('integration scenarios', () => {
    test('should work with URL validation', () => {
      // These should be valid ports for URL construction
      expect(isPort('80')).toBe(true)
      expect(isPort('443')).toBe(true)
      expect(isPort('8080')).toBe(true)
      expect(isPort('3000')).toBe(true)
    })

    test('should work with network configuration', () => {
      // Common ports used in network configuration
      expect(isPort('22')).toBe(true) // SSH
      expect(isPort('53')).toBe(true) // DNS
      expect(isPort('123')).toBe(true) // NTP
      expect(isPort('161')).toBe(true) // SNMP
      expect(isPort('514')).toBe(true) // Syslog
    })

    test('should complement IP address validation', () => {
      // Valid ports that could be used with IP addresses
      expect(isPort('80')).toBe(true)
      expect(isPort('443')).toBe(true)
      expect(isPort('22')).toBe(true)
      expect(isPort('3389')).toBe(true) // RDP
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isPort(80 as any)).toThrow()
      expect(() => isPort(null as any)).toThrow()
      expect(() => isPort(undefined as any)).toThrow()
      expect(() => isPort({} as any)).toThrow()
      expect(() => isPort([] as any)).toThrow()
      expect(() => isPort(true as any)).toThrow()
    })
  })

  describe('string format validation', () => {
    test('should only accept numeric strings', () => {
      expect(isPort('80')).toBe(true)
      expect(isPort('443')).toBe(true)
      expect(isPort('3000')).toBe(true)

      // Should reject non-numeric formats
      expect(isPort('port:80')).toBe(false)
      expect(isPort(':80')).toBe(false)
      expect(isPort('80:')).toBe(false)
      expect(isPort('tcp:80')).toBe(false)
      expect(isPort('udp:80')).toBe(false)
    })

    test('should handle all valid port ranges', () => {
      // Test a sampling across all ranges
      const testPorts = [
        '0',
        '1',
        '22',
        '80',
        '443',
        '1023', // System ports
        '1024',
        '3000',
        '8080',
        '49151', // Registered ports
        '49152',
        '55000',
        '60000',
        '65535', // Dynamic ports
      ]

      testPorts.forEach((port) => {
        expect(isPort(port)).toBe(true)
      })
    })

    test('should reject malformed numeric strings', () => {
      expect(isPort('+')).toBe(false)
      expect(isPort('-')).toBe(false)
      expect(isPort('+80')).toBe(true) // positive sign is allowed in isInt
      expect(isPort('80-')).toBe(false)
      expect(isPort('8-0')).toBe(false)
      expect(isPort('8+0')).toBe(false)
    })
  })
})
