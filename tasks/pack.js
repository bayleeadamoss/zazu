const path = require('path')
const gulp = require('gulp')
const packager = require('electron-packager')

var packOptions = {
  name: 'zazu',
  arch: 'x64',
  dir: path.join(__dirname, '..', 'app'),
  electronVersion: '1.3.1',
  'app-version': '0.3.2',
  asar: false,
  prune: true,
  overwrite: true,
  out: path.join(__dirname, '..', 'dist'),
}

gulp.task('pack', ['pack:win', 'pack:mac', 'pack:lnx'])

gulp.task('pack:win', (done) => {
  var winPackOptions = {
    platform: 'win32',
    icon: path.join(__dirname, 'resources/windows/icon.ico'),
    win32metadata: {
      CompanyName: 'Zazu, Org.',
      LegalCopyright: '',
      FileDescription: 'ZazuApp',
      OriginalFilename: 'ZazuApp',
      FileVersion: '0.3.2',
      ProductVersion: '0.3.2',
      ProductName: 'Zazu',
      InternalName: 'Zazu',
    },
  }
  Object.assign(winPackOptions, packOptions)

  packager(winPackOptions, function (err, appPath) {
    console.log('win.packager.cb =>', appPath, err)
    if (err) {
      done(err)
      return
    }
    done()
  })
})

gulp.task('pack:mac', (done) => {
  var macPackOptions = {
    platform: 'darwin',
    icon: path.join(__dirname, 'resources/windows/icon.ico'),
    'app-bundle-id': 'org.zazu.app',
  }
  Object.assign(macPackOptions, packOptions)

  packager(macPackOptions, function (err, appPath) {
    console.log('win.packager.cb =>', appPath, err)
    if (err) {
      done(err)
      return
    }
    done()
  })
})

gulp.task('pack:lnx', (done) => {
  var lnxPackOptions = {
    platform: 'linux',
    icon: path.join(__dirname, 'resources/windows/icon.ico'),
  }
  Object.assign(lnxPackOptions, packOptions)

  packager(lnxPackOptions, function (err, appPath) {
    console.log('win.packager.cb =>', appPath, err)
    if (err) {
      done(err)
      return
    }
    done()
  })
})
